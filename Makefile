.PHONY: deploy

BASE_DIR ?= site
REMOTE ?= google.com
REMOTE_USER ?= root
REMOTE_DIR ?= /tmp/nosap

deploy:
	scp -rp $(BASEDIR) $(REMOTE_USER)@$(REMOTE):$(REMOTE_DIR)