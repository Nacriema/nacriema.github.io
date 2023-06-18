---
layout: post
title: "Command that usually used in Linux - Part 1/4"
image: ''
date:	2021-01-15 16:55:00
tags:
- Ubuntu Tricks
description: ''
categories:
- Ubuntu
---


## Mục lục

[man](#man)
[ls](#ls)
[cd](#cd)
[pwd](#pwd)
[mkdir](#mkdir)
[rmdir](#rmdir)
[mv](#mv)
[cp](#cp)
[xdg-open](#xdg-open)
[touch](#touch)


## man

Đây là lệnh cho phép ta có thể hiểu được những lệnh còn lại trong Linux.

Khi ta không biết bất kỳ một lệnh nào, hãy gõ `man <command>` để có thể đọc được hướng dẫn. 

<img align="center" src="https://i.ibb.co/zHJZvCD/Screenshot-from-2021-01-15-13-30-13.png)" alt="">

Hình ảnh của lệnh man


**Tips:**  Ta cũng có những tool khác cho phép học các lệnh nhanh hơn. Ta có thể cài đặt package `tldr` rồi sau đó sử dụng lệnh `trdl<command>`, nó cho ta cái nhìn tổng quan về câu lệnh, và các trường hợp sử dụng chúng cụ thể. Mình thích sử dụng nó hơn để thay thế cho lệnh `man`, nhưng nó giúp ta tiết kiệm thời gian hơn là việc đọc một tài liệu lớn từ lệnh `man`.

Hình ảnh của lệnh `tldr`

<img src="https://i.ibb.co/7YtCbz8/Screenshot-from-2021-01-15-13-41-27.png" align="center">

## ls 

Lệnh này cho phép liệt kê các files mà bên trong folder nó có chứa sử dụng lệnh `ls`:

```
ls
```

Nếu như theo sau đó là đường dẫn tới một thư mục, thì nó sẽ liệt kê các files và thư mục bên trong đó: 

```
ls /bin
```

Ngoài ra còn có những options mà lệnh ls cung cấp như là `-al`: 

Tham số này cho phép in ra danh sách với định dạng format thông tin dài hơn như là quyền truy cập, người sở hữu, kích thước và thời gian cập nhật cuối cùng của tất cả các files.
```
ls -al /bin
```
<img src="https://i.ibb.co/V905YVn/Screenshot-from-2021-01-15-13-51-10.png" align="center">


## cd

Lệnh này cho phép thay di chuyển đến thư mục, `cd` viết tắt của **c**hange **d**irectory.

Ta cũng có những đường dẫn đặc biệt như là:

. : thư mục hiện tại

..: thư mục cha

/: thư mục root.

~: thư mục home

## pwd 
Lệnh này cho phép ta lấy được đường dẫn tuyệt đối của thư mục mà ta đang đứng. 


## mkdir
Ta có thể sử dụng lệnh `mkdir` để tạo mới một thư mục.
Ta cũng có thể tạo nhiều thư mục bẳng cách thêm nhiều tên thư mục phía sau:

```mkdir dogs cats```

Ta cũng có thể tạp nhiều thư mục mà nó lồng lẫn nhau bằng cách cho thêm tham số `-p` vào trong câu lệnh: 

```mkdir -p fruits/apples```

## rmdir

Ta có thể sử dụng lệnh `rmdir` để xóa một hoặc nhiều thư mục **trống**:

```
rmdir fruits
rmdir fruits cars
```

Nhưng khi xóa một thư mục mà nó không trống thi ta phải sử dụng câu lệnh  tổng quát hơn là `rm` và thêm vào option là `-rf` để xóa toàn bộ thư mục đó: 

```
rm -rf fruits cars
```

Cẩn thận là lệnh này nó không yêu cầu phải confirm trước khi xóa nên là việc xóa cần phải cân nhắc và việc phục hồi là rất khó khăn.

## mv

Khi ta có một file, ta có thể move chúng sử dụng câu lệnh `mv`. Ta cần truyền cho nó là thư mục hiện tại và thư mục mới:

Nếu như nó cùng cấp với nhau, thì đó là cách mà ta đổi tên cho thư mục hoặc file, ví dụ: 

```
touch pear 
mv pear new_pear
```

Thì pear sẽ đổi tên thành new_pear. Với điều kiện là new_pear là thư mục hoặc file mà chưa tồn tại trước đó.

Nếu như tham số sau cùng là một thư mục, thì những thư mục làm tham số trước đó sẽ được di chuyển vào trong thư mục cuối đó.

## cp

Ta có thể sao chép một file bằng cách dùng lệnh `cp`, ngoài ra ta cũng có thêm lựa chọn đó là tham số `-r` để mà copy toàn bộ items bên trong một thư mục vào một thư mục khác.

## xdg-open 

Lệnh `xdg-open` cho phép ta mở một file sử dụng công thức: 

```
xdg-open<filename>
```

## touch
Ta có thể tạo ra một file rỗng sử dụng lệnh `touch`.

```
touch <filename>
```
**Note**: Nếu như một file đã tồn tại, thì nó sẽ mở file đó dưới dạng write mode, và thời gian của file đó sẽ được cập nhật.


