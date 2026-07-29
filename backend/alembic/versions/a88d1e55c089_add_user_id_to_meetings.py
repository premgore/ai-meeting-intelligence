"""add user_id to meetings

Revision ID: a88d1e55c089
Revises: 4cf89438764d
Create Date: 2026-07-30 00:13:52.435566

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a88d1e55c089'
down_revision: Union[str, Sequence[str], None] = '4cf89438764d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column(
        "meetings",
        sa.Column("user_id", sa.Integer(), nullable=False),
    )

    op.create_foreign_key(
        None,
        "meetings",
        "users",
        ["user_id"],
        ["id"],
    )


def downgrade():
    op.drop_constraint(
        None,
        "meetings",
        type_="foreignkey",
    )

    op.drop_column(
        "meetings",
        "user_id",
    )