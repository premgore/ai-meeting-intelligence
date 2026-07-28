from fastapi import APIRouter

from app.schemas.echo import EchoRequest, EchoResponse

router = APIRouter()


@router.post(
    "/echo",
    response_model=EchoResponse,
)
def echo(request: EchoRequest):
    return EchoResponse(
        message=request.message
    )