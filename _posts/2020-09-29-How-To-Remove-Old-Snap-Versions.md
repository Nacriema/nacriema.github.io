---
layout: post
title:  "Remove Old Snap Versions"
image: ''
date:   2020-09-29 16:00:00
tags:
- Ubuntu Tricks
description: ''
categories:
- Ubuntu
---

## Đôi khi cái khó nó lại ló cái khôn
Nguyên nhân là do máy mình không còn đủ dung lượng, nên mình tìm mọi cách để có thể giải quyết nó. Tình cờ mình truy tìm trong ổ đía xem có cái nào mình có thể xóa được không thì thấy rằng vẫn còn rất nhiều thứ có thể xóa được, cụ thể như là thằng mình đang đề cập đến đây.

## Snap là gì ?

Nó là hệ thông quản lý phần mềm và đóng gói được xây dựng bởi Canonical. Các gói thường được gọi là các `snap` và tool để dùng chúng được gọi là `snapd`. Nó làm những công việc tương tự như thằng `apt-get` nhưng bằng cách thức khác.

## Cách dùng snap
**Tìm các snaps(apps/packages)**
Với tool snap, ta có thể thực hiện tìm kiếm các apps. Để tìm app, ta có thẻ thực hiện lệnh sau: 

`$ snap find <search_text>`


Còn nhiều thứ nữa, nhưng chắc là mình sẽ để nó ở một phần khác hen.


## Thiết lập số version của môt app tồn tại trên máy
Có một cái **snap option** (từ version 2.34) được gọi là `refresh.retain`, có thể dùng để thiết lập số lượng snap versions sao refresh tiếp theo, ta có thể thiết lập giá trị từ 2 đến 20. 

Ta có thể thay đổi chúng bằng cách sử dụng 

```python
sudo snap set system refresh.retain=2
```

Khi ta muốn loại bỏ các version cũ của một app đã được cài ra khỏi máy sau khi app đó đã được cập nhật, mình kiếm được một đoạn script để giải quyết vấn đề này:

```python
#!/bin/bash
# Removes old revisions of snaps
# CLOSE ALL SNAPS BEFORE RUNNING THIS
set -eu

LANG=en_US.UTF-8 snap list --all | awk '/disabled/{print $1, $3}' |
    while read snapname revision; do
        snap remove "$snapname" --revision="$revision"
    done
```
Sử dụng đoạn mã này sẽ giải phóng một lượng đáng kể dung lượng trong máy, cụ thể nó sẽ giải phóng vùng nhớ của thư mục `var/lib/snapd/snaps/` thông thường là trên 50%. 

Để sử dụng đoạn mã này, ta cần phải cấp quyền thực thi cho nó: 
```python 
chmod +x remove-old-snaps
```

Và thực thi cái script này với lại lệnh sudo
```python
sudo ./remove-old-snaps
```

Kết quả khi thực hiện trên máy của mình: 
```python 
core (revision 9804) removed
core18 (revision 1880) removed
gnome-3-26-1604 (revision 98) removed
gnome-3-28-1804 (revision 116) removed
gnome-3-34-1804 (revision 33) removed
gnome-calculator (revision 748) removed
gnome-characters (revision 550) removed
gnome-logs (revision 93) removed
gnome-system-monitor (revision 145) removed
gtk-common-themes (revision 1502) removed
pycharm-community (revision 209) removed
spotify (revision 41) removed
```

Và nó giải phóng được 3gb bộ nhớ cho máy của mình ^^