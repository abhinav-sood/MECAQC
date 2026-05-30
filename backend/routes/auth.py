import os
import secrets
from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse
from authlib.integrations.httpx_client import AsyncOAuth2Client
from itsdangerous import URLSafeTimedSerializer

router = APIRouter(redirect_slashes=False)

CLIENT_ID     = os.getenv('GOOGLE_CLIENT_ID')
CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
SECRET_KEY    = os.getenv('SECRET_KEY')
REDIRECT_URI  = 'http://localhost:8000/auth/callback'

serializer = URLSafeTimedSerializer(SECRET_KEY)

@router.get('/auth/login')
async def login():
    state = secrets.token_urlsafe(32)
    google_url = (
        'https://accounts.google.com/o/oauth2/v2/auth'
        f'?client_id={CLIENT_ID}'
        f'&redirect_uri={REDIRECT_URI}'
        '&response_type=code'
        '&scope=openid%20email%20profile'
        f'&state={state}'
    )
    response = RedirectResponse(url=google_url)
    response.set_cookie(key='oauth_state', value=state, httponly=True, max_age=300)
    return response

@router.get('/auth/callback', name='auth_callback')
async def auth_callback(request: Request):
    state_in_params = request.query_params.get('state')
    state_in_cookie = request.cookies.get('oauth_state')

    if not state_in_cookie or state_in_params != state_in_cookie:
        return {'error': 'State mismatch'}

    code = request.query_params.get('code')

    async with AsyncOAuth2Client(
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        redirect_uri=REDIRECT_URI,
    ) as client:
        token = await client.fetch_token(
            'https://oauth2.googleapis.com/token',
            code=code,
        )
        userinfo_resp = await client.get('https://openidconnect.googleapis.com/v1/userinfo')
        userinfo = userinfo_resp.json()

    session_token = serializer.dumps({'email': userinfo['email'], 'name': userinfo['name']})
    response = RedirectResponse(url='http://localhost:5173', status_code=302)
    response.set_cookie(key='session', value=session_token, httponly=True, samesite='lax', max_age=60*60*24*7)
    response.delete_cookie('oauth_state')
    return response

@router.get('/auth/me')
async def auth_me(request: Request):
    cookie = request.cookies.get('session')
    if not cookie:
        return {'user': None}
    try:
        data = serializer.loads(cookie, max_age=60*60*24*7)
        return {'user': data}
    except Exception:
        return {'user': None}

@router.post('/auth/logout')
async def auth_logout():
    response = RedirectResponse(url='http://localhost:5173', status_code=302)
    response.delete_cookie('session')
    return response