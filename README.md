# Mạng Xã Hội Sức Khỏe

## Phần 1: Use Case

### Tổng Quan
Dự án này là một mạng xã hội về sức khỏe, nơi người dùng có thể tương tác với nhau và với các chuyên gia y tế (bác sĩ) để nhận tư vấn sức khỏe, đặt lịch hẹn, chia sẻ kiến thức và nhiều hơn nữa. Hệ thống bao gồm ba loại người dùng: Người dùng, Bác sĩ, và Quản trị viên, mỗi đối tượng có các chức năng và quyền hạn riêng.

### Các Đối Tượng:
- **Người dùng**: Tạo tài khoản, chia sẻ bài viết, đặt lịch hẹn, và tương tác với bác sĩ thông qua tin nhắn và cuộc gọi.
- **Bác sĩ**: Tư vấn sức khỏe, nhận lịch hẹn, tin nhắn và cuộc gọi từ người dùng.
- **Quản trị viên**: Quản lý người dùng, bác sĩ, và nội dung bài viết, đồng thời theo dõi thống kê hệ thống.

### Các Tính Năng Chính:

- **Người dùng**:
  - Đăng nhập/Đăng ký tài khoản
  - Tìm kiếm và xem bài viết về sức khỏe
  - Bình luận và chia sẻ bài viết
  - Đặt lịch hẹn với bác sĩ
  - Nhắn tin và gọi điện để nhận tư vấn từ bác sĩ
  - Cập nhật thông tin cá nhân

- **Bác sĩ**:
  - Nhận lịch hẹn, tin nhắn và cuộc gọi từ người dùng
  - Tư vấn sức khỏe qua tin nhắn và cuộc gọi

- **Quản trị viên**:
  - Xem thống kê về hệ thống
  - Quản lý danh mục bài viết và hồ sơ bác sĩ
  - Duyệt nội dung và bài viết do người dùng tạo

## Phần 2: Giao Diện

### 1. Giao Diện Cập Nhật Hồ Sơ Cá Nhân:
![Giao Diện Cập Nhật Hồ Sơ Cá Nhân](https://github.com/user-attachments/assets/d9738480-4693-4927-b7c7-508360d8ad11)

Người dùng có thể cập nhật thông tin cá nhân bao gồm tên, số điện thoại, địa chỉ, và các thông tin liên quan đến cá nhân.

### 2. Giao Diện Tìm Kiếm và Chia Sẻ Bài Viết:
![Giao Diện Tìm Kiếm và Chia Sẻ Bài Viết](https://github.com/user-attachments/assets/d6d844a5-efee-408e-877a-9aedcbe55e1d)

Người dùng có thể tìm kiếm các bài viết về sức khỏe, đọc và chia sẻ chúng lên mạng xã hội. Mỗi bài viết đều có phần bình luận cho phép người dùng tương tác và thảo luận với nhau.

### 3. Giao Diện Đặt Lịch Hẹn:
![Giao Diện Đặt Lịch Hẹn](https://github.com/user-attachments/assets/602d8c19-4c09-45f4-abc2-6ae577b70bb2)

Người dùng có thể chọn bác sĩ phù hợp và đặt lịch hẹn trực tiếp thông qua giao diện đơn giản. Thời gian trống của bác sĩ sẽ được hiển thị để người dùng chọn.

### 4. Giao diện chat:
![Giao diện chat](https://github.com/user-attachments/assets/74eb69fa-60d7-40fe-91d4-a9227a4d2b1e)

Người dùng có thể trò chuyện với bác sĩ thông qua giao diện chat.

### 5. Giao diện chi tiết cuộc hẹn:
![Giao diện chi tiết cuộc hẹn](https://github.com/user-attachments/assets/356862f6-5f48-4111-833a-24fd4d13b4ae)

Người dùng có thể xem tổng quan cuộc hẹn như thời gian, địa điểm, bác sĩ, ...

### 6. Giao diện trang chủ:
![Giao diện trang chủ](https://github.com/user-attachments/assets/fc07b34f-2aed-4480-8dd4-ea77ec4c9753)

Người dùng có thể lướt xem các bài đăng, like, comment hoặc share bài viết.

### 7. Giao diện chi tiết bài viết:
![Giao diện chi tiết bài viết](https://github.com/user-attachments/assets/557f2018-56aa-43f9-97ff-e4617a371085)

Người dùng có thể xem chi tiết thông tin về một bài viết, số lượt like, share, tất cả những bình luận về bài viết.

### 8. Giao diện thông báo:
![Giao diện thông báo](https://github.com/user-attachments/assets/89bba95d-429f-4c94-b446-22415def00c1)

Người dùng có thể xem thông báo như ai đã thích bài viết, ai đã comment bài viết và nhiều thông báo khác liên quan đến cá nhân người dùng.

## Công Nghệ Sử Dụng:
- **Frontend**: ReactJS để xây dựng giao diện người dùng.
- **Backend**: Nest.js để xử lý logic và dữ liệu phía server.
- **Cơ Sở Dữ Liệu**: MongoDB để lưu trữ thông tin.
