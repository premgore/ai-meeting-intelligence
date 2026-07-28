from datetime import datetime

from pydantic import BaseModel
from pydantic import ConfigDict
from pydantic import EmailStr
from pydantic import Field


class CreateUserRequest(BaseModel):
    name: str = Field(
        ...,
        min_length=3,
        max_length=100,
        example="Prem Gore",
    )

    email: EmailStr = Field(
        ...,
        example="prem@gmail.com",
    )

    password: str = Field(
        ...,
        min_length=6,
        max_length=100,
        example="password123",
    )


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )