{
    "name": "example",
    "version": 1,
    "update": {
        "url": "{{ config_url }}",
        "@schedule": {
            "interval": 600
        }
    },
    "archive": {
        "@schedule": {
            "interval": 600
        }
    },
    "upload": {
        "url": "{{ upload_url }}",
        "@schedule": {
            "interval": 60
        }
    },
    "data": [
        {
            "@type": "edu.mit.media.funf.probe.builtin.SimpleLocationProbe",
            "@schedule": {
                "interval": 60
            },
            "maxWaitTime": 30,
            "goodEnoughAccuracy": 50
        }
    ]
}
