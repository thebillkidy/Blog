---
layout: post
current: post
cover: 'assets/images/covers/databricks.png'
navigation: True
title: Sending emails in Databricks by using Scala
date: 2019-01-10 09:00:00
tags: databricks coding-scala
class: post-template
subclass: 'post'
author: xavier
---

This is going to be quite a short post, but is more intended as reference :) 

Something I found to be quite interesting is sending emails through Databricks to warn me when something happened in parts of my code. After searching a bit, I came up with this code that would help me send an email:

> Databricks secrets are being used, check out my other post on how to configure those: [Databricks Secrets](/databricks-using-secrets)

```scala
import java.util.Properties
 
import java.util.Properties
import javax.mail.{Message, Session}
import javax.mail.internet.{InternetAddress, MimeMessage}

import scala.io.Source

val host = "<YOUR_SMTP>"
val port = "587"

val address = "<YOUR_EMAIL>"
val username = "<YOUR_USERNAME>"
val password = dbutils.secrets.get("<SECRET_SCOPE>", "EMAIL_SMTP_PASSWORD") 

def sendEmail(mailSubject: String, mailContent: String) = {
    val properties = new Properties()
    properties.put("mail.smtp.port", port)
    properties.put("mail.smtp.auth", "true")
    properties.put("mail.smtp.starttls.enable", "true")

    val session = Session.getDefaultInstance(properties, null)
    val message = new MimeMessage(session)
    message.addRecipient(Message.RecipientType.TO, new InternetAddress(address));
    message.setSubject(mailSubject)
    message.setContent(mailContent, "text/html")


    val transport = session.getTransport("smtp")
    transport.connect(host, username, password)
    transport.sendMessage(message, message.getAllRecipients)
}
```