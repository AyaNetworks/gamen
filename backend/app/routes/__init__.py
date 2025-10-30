"""API route modules."""

from fastapi import APIRouter

# Import route modules
from . import auth
from . import users
from . import chats
from . import projects
from . import tasks
from . import libraries
from . import artifacts

# Create main router
api_router = APIRouter(prefix="/api/v1")

# Include routers
api_router.include_router(auth.router, tags=["Authentication"])
api_router.include_router(users.router, tags=["Users"])
api_router.include_router(chats.router, tags=["Chats"])
api_router.include_router(projects.router, tags=["Projects"])
api_router.include_router(tasks.router, tags=["Tasks"])
api_router.include_router(libraries.router, tags=["Libraries"])
api_router.include_router(artifacts.router, tags=["Artifacts"])

__all__ = ["api_router"]
