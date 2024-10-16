.PHONY: set-url
url = https://new-api-url.com

set-url:
	@echo "Updating baseUrl in environment.dart with $(url)..."
	@sed -i "s|baseUrl = '.*';|baseUrl = '$(url)';|g" lib/environment.dart