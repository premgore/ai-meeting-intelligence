from app.tools.search_tool import search_meetings

print(search_meetings.invoke(
    {
        "query": "JWT Authentication"
    }
))