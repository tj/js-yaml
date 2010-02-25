
all: test
	
test:
	@node spec/node.js
	
.PHONY: test