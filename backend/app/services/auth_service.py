from tortoise.exceptions import DoesNotExist, IntegrityError
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin
from app.core.security import get_password_hash, verify_password


class AuthService:
    @staticmethod
    async def register(user_data: UserCreate) -> User:
        try:
            hashed_password = get_password_hash(user_data.password)
            user = await User.create(
                username=user_data.username,
                email=user_data.email,
                hashed_password=hashed_password,
            )
            # Tortoise with MySQL doesn't properly set id on create - re-fetch to get actual ID
            if user.id is None:
                user = await User.get(email=user_data.email)
            return user
        except IntegrityError:
            raise ValueError("User with this email or username already exists")

    @staticmethod
    async def authenticate(credentials: UserLogin) -> User:
        try:
            user = await User.get(email=credentials.email)
        except DoesNotExist:
            raise ValueError("Invalid email or password")

        if not verify_password(credentials.password, user.hashed_password):
            raise ValueError("Invalid email or password")

        return user

    @staticmethod
    async def get_user_by_id(user_id: int) -> User:
        return await User.get(id=user_id)