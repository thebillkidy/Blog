---
layout: project
title: Everbit
date_started: 2017-01-12
date_ended:  2016-01-09
picture_cover: 'assets/images/projects/everbit/view_main.png' 
picture_gallery_1: 'assets/images/projects/everbit/view_database.png' 
picture_gallery_2: 'assets/images/projects/everbit/view_main.png' 
picture_gallery_3: 'assets/images/projects/everbit/landings_page.jpg' 
tags: automatic database infrastructure migration sql # , delimited
background: 5e3ab7 # Can be a color or a picture url
logo: 'assets/images/projects/everbit/logo_white.png' # Can be a picture url or a name
class: project-template
---

Everbit was a project that I started together with Jesper Lindstrom to revolutionize the way we work with SQL databases. The goal of this project was to allow us to work with databases, as we worked with git. When a developer changed the database locally, and wants to push the changes of this database to a public repository, the only thing he/she had to do was run a small CLI command and push those changes to the online Everbit repository. In the background, the Everbit servers would then generate a SQL Upgrade and Downgrade migration script, that allows the user to rollback, or fast-forward to any required version.

The whole system and website were written in PHP and the infrastructure was automated with Ansible (to allow our infrastructure to scale when we needed more comparison databases)

## My Role

I was responsible for creating the whole project Backend wise (API/Infrastructure/DB Migration Creation/CLI Tool) while Jesper was responsible for the Design and Frontend.

## Outcome

The project made it into a Alpha version with every feature possible, but was halted due to the lack of time and more needed market research. If an opportunity comes around again in the future, we could reconsider restarting this project.
