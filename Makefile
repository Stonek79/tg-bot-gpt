build:
	docker build -t tggpt .

run:
	docker run -d -p 3000:3000 --name tggpt --rm tggpt
