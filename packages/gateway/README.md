# Entomophage-gateway

This is the API gateway for the issue/bug tracker Entomophage. This is not a classic service as it is a giant router, with an authenticaiton middleware.

## About

Most of the routes have the same principle to them, with exception to the '/login' and '/register' routes.

This service is much more needed for the authenticaiton middleware and one service endpoint than for anything else.

Most of the comments are reused from the service routes. This is because it mostly reroutes all of the services onto one route so i think the comments should stay the same, atleast all together as a glossary all in one place.

This could've been done by a framework in < 100 lines of code.

### This is a work in progress

If it's needed for anything else it will not be replaced by a dedicated gateway, else it's here just to serve as a possibility.
