---
layout: post
title:  "Symbolic Links on Ubuntu"
image: ''
date:   2020-10-02 18:00:00
tags:
- Ubuntu Tricks
description: ''
categories:
- Ubuntu
---
<p class="music-read"><q>Life is like riding a bicycle. To keep your balance you must keep moving.</q> ---ALBERT EINSTEIN</p>

<img src="/assets/img/symlink/ubuntu.jpg" alt="cover"/>

## Mục đích

Lại là chuyên mục lười biếng của mình. Hiện tại đường dẫn đến thư mục của mình nó quá dài, mỗi lần truy cập bằng Terminal nó là một cực hình đối với mình. May thay trên Ubuntu nó có cái tính năng dành cho người lười gõ như mình. Thay vì gõ một mớ chữ, thì mình chỉ cần gõ vài dòng ngắn thôi mà đã có thể truy cập được cái thư mục mà mình cần. Đó là công dụng của "Symbolic link", hay còn được gọi với cái tên "Symlink".


## Bản chất của Symlink

Symlink cho phép ta có thể tạo ra được một thư mục ảo, hoặc là một file ảo với cái thư mục mình đang thực sự muốn đến. Khi ta gọi đến thư mục ảo đó và thao tác bên trong đấy thì hệ thống sẽ làm việc với lại file hoặc thư mục gốc đó.

Ví dụ: 

Thông thường mình phải truy cập đường dẫn dài loằng ngoằng để đến với thư mục làm việc của mình: 

```
/media/hp/01D576CEBCC511F0/Ubuntu/Pytorch
```

Thay vào đó mình muốn rút gọn lại thành 

```
/myPytorch
```

Và một khi mình cd đến thư mục /myPytorch thì hệ thống hiểu là mình muốn làm việc với lại đường dẫn gốc.

## Cách tạo Symlink

Trên Linux, có công cụ tên là "ln", cho phép ta tạo ra các symlink, cú pháp của nó như sau: 

```
ln -s <source_file_directory> <link_file_directory>
```

Ví dụ, nếu mình muốn tạo một symlink của thư mục "/media/hp/01D576CEBCC511F0/Ubuntu/Pytorch" thành "/myPytorch", ta thực hiện lệnh sau: 

```
sudo ln -s /media/hp/01D576CEBCC511F0/Ubuntu/Pytorch /myPytorch
```

<img src="/assets/img/symlink/set.png" alt="set" width="100%"/>

Để kiểm tra kết quả, ta có thể gọi đến symlink ta mới tạo và check thư mục bên trong đó. 

```python
cd /myPytorch
```

<img src="/assets/img/symlink/check.png" alt="check" width="100%"/>

Cái symlink thực chất không phải là một thư mục. Thay vào đó là một cái link đến thư mục gốc "/media/hp/01D576CEBCC511F0/Ubuntu/Pytorch".

## Tạo một Symlink lâu dài

Chú ý rằng cái symlink ở trên chỉ tồn tại khi máy tính mình vẫn còn làm việc, một khi khởi động lại máy thì nó sẽ biến mất. Để có thể biến chúng tồn tại lâu, ta đơn giản là bỏ đi cái tham số "-s". Và nó sẽ tạo thành một HARD LINK.

## Cách xóa Symlink

Để mà xóa đi Symlink, đầu tiên phải có quyền w đối với thư mục mà tồn tại symlink. 

Tiếp theo là ta sử dụng lệnh:

```python
ln -l 
```
để kiểm tra xem file hoặc folder đó có tồn tại symlink tới nó hay không.

Ví dụ: 

```
ls -l /usr/bin/python
```
Output: 

```
lrwxrwxrwx 1 root root 9 Apr 16  2018 /usr/bin/python -> python2.7
```
Ký tự l trong output chỉ ra rằng nó có symlink. Ký hiệu "->" cho biết rằng file đó có symlink trỏ đến.

Bước kế tiếp, ta sử dụng lệnh **rm**

Lệnh **rm** cho phép ta gỡ bỏ files và thư mục.

Để xóa symlink, sử dụng lệnh **rm** với lại tên symlink cần muốn xóa:

```
rm symlink_name
```

Để xóa nhiều symlink cùng một lúc, ta có thể pass nhiều tên vào với nhau và cách nhau bởi dấu cách

```
rm symlink1 symlink2
```

Sau đó gõ "y" và ấn Enter để đồng ý xóa. 


Bài viết này mình sẽ bổ sung thêm vài phần nữa. Nếu các bạn thấy hay hãy cho mình một share, nếu các bạn có ý kiến gì để cải thiện nội dung, hãy để lại một bình luận bên dưới để cho mình được biết thêm nhé.