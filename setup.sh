dnf install -y python-pip python-devel git nginx gcc
pip install uwsgi

mkdir -p /var/www/
cd /var/www

if ! ls | grep "game" >/dev/null; then
	git clone https://github.com/theyoyojo/game
	cd game
	pip install -r requirements.txt
fi

# add this to nginx.conf main server block:


        #location /data {
		#alias /var/www/game/data;
#
	#}
#
	#location = / {
		#include uwsgi_params;
		#uwsgi_pass uwsgi://localhost:9090;
	#}


# don't forget to set server_name in nginx conf for the certbot step!

# TLS:
# https://www.nginx.com/blog/using-free-ssltls-certificates-from-lets-encrypt-with-nginx/
