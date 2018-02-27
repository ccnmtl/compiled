STAGING_URL=https://compiled.stage.ccnmtl.columbia.edu/
PROD_URL=https://compiled.ctl.columbia.edu/
STAGING_BUCKET=compiled.stage.ccnmtl.columbia.edu
PROD_BUCKET=compiled.ctl.columbia.edu
INTERMEDIATE_STEPS ?= make $(PUBLIC)/js/all.json
HUGO=/usr/local/bin/hugo-0.35

JS_FILES=static/js/src

all: eslint

include *.mk

$(PUBLIC)/js/all.json: $(PUBLIC)/json/all/index.html
	mkdir $(PUBLIC)/js/ || true
	mv $< $@ && ./checkjson.py
