#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Update package lists
echo "Updating package lists..."
apt-get update

# Install Python and required dependencies
echo "Installing Python and pip..."
apt-get install -y python3 python3-pip

# Verify Python installation
echo "Checking Python version..."
python3 --version

# Install required Python libraries
echo "Installing required Python packages..."
pip3 install requests pdfplumber python-docx

echo "Python setup completed successfully!"
