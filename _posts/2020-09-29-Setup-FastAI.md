---
layout: post
title:  "Setup FastAI"
image: ''
date:   2020-09-29 17:00:00
tags:
- Ubuntu Tricks
- Fastai
description: ''
categories:
- Ubuntu
- Fastai
---

## Mục đích

Mình viết bài này để ghi lại kinh nghiêm khi mình thực hiện cấu hình và cài đặt fastai

## Fastai là gì ?

## Cách cài đặt nó
Dùng pip: 
```python 
pip install fastai
```

## Cấu hình

Tiếp tục là series vọc vạc để tiết kiệm vùng nhớ home trên máy, mình bắt buộc phải thiết lập cài đặt cho thằng fastai. Cái file cấu hình của nó là: config.yml. File này nó nằm trong thư mục 
```python 
hp@n-a-c-r-i-e-m-a:~/.fastai$
```

Về mặc định thì nó sẽ thiết lập toàn bộ ở trong thư mục home của máy, nhưng mình thì muốn nó ra bên ngoài của ổ media nên là mình sửa toàn bộ mọi thử sang bên đó như sau: 

```python 
archive_path: /media/hp/01D576CEBCC511F0/Ubuntu/.fastai/archive
data_path: /media/hp/01D576CEBCC511F0/Ubuntu/.fastai/data
model_path: /media/hp/01D576CEBCC511F0/Ubuntu/.fastai/models
storage_path: /media/hp/01D576CEBCC511F0/Ubuntu/tmp
version: 2
```

Vậy là ok rồi, khi mà mình sử dụng fastai để tải bộ dữ liệu có sẵn hay là model thì nó sẽ được lưu trữ toàn bộ sang bên ngoài, không còn dính chi tới bên trong nữa rồi.

Bài viết này vẫn còn vài thứ nữa nghe, nếu như trong quá trình mình làm mà có cái chi mình tìm hiểu được thì sẽ tiếp tục cập nhật ở trên này. 
