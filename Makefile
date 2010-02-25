
all: test
	
test:
	jspec run --rhino
	
.PHONY: test