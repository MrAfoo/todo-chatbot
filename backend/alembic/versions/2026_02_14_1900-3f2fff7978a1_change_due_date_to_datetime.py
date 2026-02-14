"""change_due_date_to_datetime

Revision ID: 3f2fff7978a1
Revises: 3cfbfd0ad8e1
Create Date: 2026-02-14 19:00:27.889139

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3f2fff7978a1'
down_revision: Union[str, None] = '3cfbfd0ad8e1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Change due_date from Date to DateTime
    op.alter_column('tasks', 'due_date',
                    type_=sa.DateTime(),
                    existing_type=sa.Date(),
                    existing_nullable=True)


def downgrade() -> None:
    # Change due_date from DateTime back to Date
    op.alter_column('tasks', 'due_date',
                    type_=sa.Date(),
                    existing_type=sa.DateTime(),
                    existing_nullable=True)
