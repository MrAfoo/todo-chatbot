"""add_priority_category_due_date_to_tasks

Revision ID: 3cfbfd0ad8e1
Revises: add_conversations
Create Date: 2026-02-05 21:53:01.736529

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '3cfbfd0ad8e1'
down_revision: Union[str, None] = 'add_conversations'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create enum types first
    taskpriority_enum = postgresql.ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT', name='taskpriority')
    taskpriority_enum.create(op.get_bind(), checkfirst=True)
    
    taskcategory_enum = postgresql.ENUM('PERSONAL', 'WORK', 'SHOPPING', 'HEALTH', 'LEARNING', 'PROJECT', 'OTHER', name='taskcategory')
    taskcategory_enum.create(op.get_bind(), checkfirst=True)
    
    # Add columns with default values
    op.add_column('tasks', sa.Column('priority', sa.Enum('LOW', 'MEDIUM', 'HIGH', 'URGENT', name='taskpriority'), nullable=False, server_default='MEDIUM'))
    op.add_column('tasks', sa.Column('category', sa.Enum('PERSONAL', 'WORK', 'SHOPPING', 'HEALTH', 'LEARNING', 'PROJECT', 'OTHER', name='taskcategory'), nullable=False, server_default='OTHER'))
    op.add_column('tasks', sa.Column('due_date', sa.Date(), nullable=True))
    
    # Remove server defaults after adding columns (so they're only used for existing rows)
    op.alter_column('tasks', 'priority', server_default=None)
    op.alter_column('tasks', 'category', server_default=None)


def downgrade() -> None:
    # Drop columns
    op.drop_column('tasks', 'due_date')
    op.drop_column('tasks', 'category')
    op.drop_column('tasks', 'priority')
    
    # Drop enum types
    taskpriority_enum = postgresql.ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT', name='taskpriority')
    taskpriority_enum.drop(op.get_bind(), checkfirst=True)
    
    taskcategory_enum = postgresql.ENUM('PERSONAL', 'WORK', 'SHOPPING', 'HEALTH', 'LEARNING', 'PROJECT', 'OTHER', name='taskcategory')
    taskcategory_enum.drop(op.get_bind(), checkfirst=True)
