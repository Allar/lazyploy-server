# Lazyploy Server

Lazyploy Server is the central server component of the Lazyploy suite of tools. It is a Node.js Feathers REST API backend server as well as a web frontend server.

Lazyploy Server can govern, recieve, distribute, and monitor builds of UE4 projects. The only limit to how much it can store is the size of the storage device it is installed on. 

I originally wrote this so I can rapidly test UE4 cooked server builds on Windows and Linux without managing batch files for auto-deployment or setting up a Jenkins server. I wanted an automated deployment system that was incredibly easy to use with UE4 that requires minimal setup and just works. That being said, this is still very rough and many things don't work or aren't built. At its current state, it allows very rapid iteration for development builds of UE4 projects. Incredibly useful if you are an engineer who is writing server-only code and doesn't want to send a build through the Steam Pipe or bulkier pipeline. This was written so I can make ridiculously easy use of a 32-VM server on my local network for testing UE4 builds.

# Installation

It can be installed locally, on a LAN, or a remote server. Please note that this project hasn't been appropriately security hardened so please _ONLY RUN ON TRUSTED NETWORKS_. Because of this, remote and public facing deployments of Lazyploy Server are _NOT RECOMMENDED AND DANGEROUS_.

## Requirements

You must have Node.js and NPM installed.
If you are on Windows, check out [Node.js's Website](https://nodejs.org/en/).
If you are on some form of Linux, use this to install the latest version of Node.js:
    
    sudo apt-get install curl
    curl --silent --location https://deb.nodesource.com/setup_5.x | sudo bash -
    sudo apt-get install nodejs
    sudo apt-get install npm

Port 80 must also be available on the server. If you are running locally on Windows, be careful about programs that use Port 80 such as Skype. If you are using Skype, you will need to go to `Tools -> Options -> Advanced -> Connection` and disable "Use port 80".

## Setup

1. Clone this repo and install the dependencies by running `npm install` in the repo's folder using either a Windows command prompt or a Linux shell.
1. Start the server by running `npm start`

## Usage

While Lazyploy could easily be extended to not be UE4 specific and to support any client capable of REST API calls, there are currently only three ways of interacting with Lazyploy Server.

1. Use the web interface. The web interface will allow you to monitor servers and builds. To use the web interface, simply navigate to the hostname or ip address of the machine you installed Lazyploy Server on. For example, if you installed it locally, point your browser to [http://localhost/].
1. Use the [Lazyploy Launcher](https://github.com/Allar/lazyploy-launcher) to upload builds to Lazyploy Server.
1. Use the [Lazyploy Watcher](https://github.com/Allar/lazyploy-watcher) to start servers and automatically download and run builds distributed by Lazyploy Server.

# Support

Support for this is currently limited as this is an ongoing project. Please give feedback and report any issues you may have, but it may take me some time to respond. If you would like to contribute, please do and submit a pull request!

Forum thread: https://forums.unrealengine.com/showthread.php?100619-Lazyploy-Like-Jenkins-but-lazier&p=473196#post473196