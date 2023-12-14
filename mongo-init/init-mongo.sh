#!/bin/bash
set -e

mongosh -- "$MONGO_DATABASE" <<EOF
    db.createUser({
        user: '$MONGO_USER',
        pwd: '$MONGO_PASSWORD',
        roles: [{
            role: 'readWrite',
            db: '$MONGO_DATABASE'
        }]
    });
EOF
