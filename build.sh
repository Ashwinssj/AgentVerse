#!/usr/bin/env bash
# exit on error
set -o errexit

cd backend
chmod +x build.sh
./build.sh
