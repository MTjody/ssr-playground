---
title: 'I hate passwords - Enter KeePass'
date: '2020-05-05'
---

## Why
Nothing is more annoying than the error message `Wrong username or password`. I take that back, knowing that **the past you** once set the password that is preventing current you from logging in is more annoying! The solution? A password manager!

## What
Most password managers have a free version. The thing is, I need the passwords on all devices I use, and any future device, but these features will make the services start billing you. So after some light digging I found [KeePass](https://keepass.info/) - **an open source password manager** which writes account credentials and meta-data to a file which you can store wherever. The file is encrypted and only accessible with a master password (which I unfortunately have to remember). Since it's an encrypted file, it can be placed *'anywhere'* - preferrably somewhere safe - such as a flash memory or a cloud-based storage service. On top of this, you're now able to keep separate account types in different files, placed on different locations. E.g. one file for work logins, and one for personal logins. 

## How 

*Sounds good, so where do I start?*

Personally, I have a Mac Laptop and an Android Phone. The offical page lists [clients for most OS's](https://keepass.info/download.html), so chances are you'll find the ones you need. So I downloaded [MacPass for OSX](https://macpassapp.org/) and [KeePassDx for Android](https://play.google.com/store/apps/details?id=com.kunzisoft.keepass.free). Since G-Suite is the cloud of choice for my workplace, I've got my encrypted DB file saved there. To enable file read/write for MacOS via Drive I installed [Google Drive File Stream](https://www.google.com/drive/download/). As soon as I save new passwords from my computer, they'll be accessible from my other connected clients as well.    

On my laptop, I double click on a password to copy to clipboard. You could also enable Autotype which could fill out the login form for you. On my Android I recently enabled the autofill feature found in `Settings - Form Filling - Autofill`.

For more information on nifty features and how to use them, just check the docs for the clients you end up with. Fingerprint unlock works for the Android client, but the MacPass client has an open [Feature Request](https://github.com/MacPass/MacPass/issues/514) for TouchID support. It's been open for a while, so if you feel like a hero you could start contributing right away ;p
