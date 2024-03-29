# cloudflare-ddns
Automatically update your Cloudflare DNS when your public IP changes

<p align="center">
    <a href="https://github.com/zachstence/cloudflare-ddns/blob/main/LICENSE">
        <img alt="license mit" src="https://img.shields.io/github/license/zachstence/cloudflare-ddns?style=for-the-badge" />
    </a>
    <br />
    <a href="https://hub.docker.com/r/zachstence/cloudflare-ddns">
        <img alt="docker pulls" src="https://img.shields.io/docker/pulls/zachstence/cloudflare-ddns?style=for-the-badge" />
        <img alt="docker size" src="https://img.shields.io/docker/image-size/zachstence/cloudflare-ddns?style=for-the-badge" />
    </a>
    <br />
    <a href="#">
        <img alt="wakatime" src="https://wakatime.com/badge/user/2a0a4013-ea89-43b7-99d9-1a215b4c34d0/project/440bac4f-98d5-4762-ac2f-117b0ea4c805.svg?style=for-the-badge" />
    </a>
</p>

## Table of Contents
- [Usage](#usage)
  - [Run using Docker](#run-using-docker)
  - [Run using `docker-compose`](#run-using-docker-compose)
- [Future Features](#future-features)

## Usage
1. [Create a Cloudflare API token](https://developers.cloudflare.com/api/tokens/create/) with the following configuration

    ![docs/permissions.png](docs/permissions.png)

    Permissions
    - Zone - Zone - Read
    - Zone - DNS - Edit

    Zone Resources
    - Include - All zones

2. [Identify your Cloudflare Zone ID](https://developers.cloudflare.com/fundamentals/get-started/basic-tasks/find-account-and-zone-ids/)

    ![docs/zone-id.png](docs/zone-id.png)

3. Copy [`config.json.template`](config.json.template) to a new file named `config.json`

    | Config                  | Description                                                  | Example                                    |
    | ----------------------- | ------------------------------------------------------------ | ------------------------------------------ |
    | `cloudflare.apiToken`   | A Cloudflare API Token with the [proper permissions](#usage) | `XDX6YXn0MU2tpwJUa49UYLrtS5r4q-Ia9ng6H5Pu` |
    | `zones.zoneId`          | The Zone ID of the domain you want to update DNS for         | `gq3pvvxfr6x4fpfdgz7w7n4d3ckfk9pk`         |
    | `zones.recordNames`     | The name of each record you would like to update             | `example.com`                              |
    | `intervalSeconds`       | How often to check your DNS records (in seconds)<sup>1</sup> | `300`                                        |

    <sup>1</sup> [Cloudflare's Rate Limits](https://support.cloudflare.com/hc/en-us/articles/200171456-How-many-API-calls-can-I-make) are pretty lenient, so feel free to set the interval as small as you want.

4. Run `cloudflare-ddns` using your `config.json`

    #### Run using Docker
    ```sh
    docker run \
        -v /path/to/config.json:/app/config.json \
        zachstence/cloudflare-ddns
    ```

    #### Run using `docker-compose`
    ```yaml
    version: "3.8"

    services:
    cloudflare-ddns:
        image: zachstence/cloudflare-ddns
        volumes:
        - /path/to/config.json:/app/config.json:ro
        restart: unless-stopped
    ```

## Future Features
- Accept file for Cloudflare API token to enable better security (Docker secrets)
