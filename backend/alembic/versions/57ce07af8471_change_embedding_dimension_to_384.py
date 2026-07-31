from typing import Sequence, Union

from alembic import op
from pgvector.sqlalchemy import Vector
import sqlalchemy as sa


revision = "57ce07af8471"
down_revision = "f11fffd57bba"
branch_labels = None
depends_on = None


def upgrade():
    op.drop_column("meetings", "embedding")

    op.add_column(
        "meetings",
        sa.Column("embedding", Vector(384), nullable=True),
    )


def downgrade():
    op.drop_column("meetings", "embedding")

    op.add_column(
        "meetings",
        sa.Column("embedding", Vector(1536), nullable=True),
    )