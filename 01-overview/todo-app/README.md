# Todo App Homework

## 1. Initializing Django project

**Prompt**: *Initialize a django project named 'todo-app' using uv*.

Commands run:
```shell
uv init --no-readme
uv add django
uv run django-admin startproject todo_app .
```

## 2. Creating Djanto app

**Prompt**: "I already have the initial boilerplate for django. Now do I need to edit any files to include the application?"

Command to create app folder structure:
```shell
uv run python manage.py startapp todos
```

Then, `settings.py` is edited, adding `'todos'` to `INSTALLED_APPS`.

## Useful commands

Running development server:
```shell
uv run python manage.py runserver
```

Making db model migrations:
```shell
uv run python manage.py migrate
```


