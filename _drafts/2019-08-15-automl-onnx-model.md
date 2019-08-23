---
layout: post
current: post
cover: 'assets/images/covers/iot.jpg'
navigation: True
title: Azure AutoML - Generating an ONNX Model
date: 2019-08-15 09:00:05
tags: azure coding-javascript iot
class: post-template
subclass: 'post'
author: xavier
---

As covered before in our [AutoML - Telco Churn Prediction](/automl-interface-telco-churn-prediction) post, we could see that we can easily generate a model when we feed some data to it and specify what we want to do with it (classification, regression, ...).

The Data Science community however is now converging more and more towards [ONNX (Open Neural Network Exchange Format)](http://onnx.ai/). Which is an open standard for interchangeable AI models. So it would be interesting if AutoML could produce ONNX models for us.

Luckily it can do just that! But it is sadly enough not supported through the interface yet.