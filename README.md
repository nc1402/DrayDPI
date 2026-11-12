# Landing page DrayTek Vigor2928 – DrayDPI | AN PHÁT

**Bản triển khai chính thức – Giai đoạn 4 (được duyệt bố cục tại Giai đoạn 3)**

## Nội dung

- `index.html`: trang landing page; chứa sẵn bộ dữ liệu 4.620 ứng dụng / 29 nhóm, trong đó 3.368 ứng dụng hỗ trợ App Route Policy (theo tài liệu EC3 v5.5.0, database 1.830.0-20).
- `assets/site.css`: giao diện, responsive và hiệu ứng.
- `assets/site.js`: menu, bộ tab, demo DPI và bộ lọc bảng ứng dụng.
- `images/`: bộ 6 hình đã duyệt, ảnh Vigor2928 từ tài liệu người dùng cung cấp và logo AN PHÁT.
- `.nojekyll`: cho phép GitHub Pages phục vụ trang tĩnh trực tiếp.

## Triển khai lên GitHub Pages

1. Tạo repository GitHub mới hoặc dùng repository đang có.
2. **Giải nén file ZIP**. Upload trực tiếp `index.html`, thư mục `assets/`, `images/`, `.nojekyll` vào **thư mục gốc repository** (không upload nguyên thư mục bao ngoài).
3. Vào **Settings → Pages → Build and deployment**, chọn **Deploy from a branch**, nhánh `main`, thư mục `/(root)` rồi **Save**.
4. Mở đường dẫn GitHub Pages sau khi GitHub triển khai xong; kiểm tra hình và nút báo giá.

Không cần Node.js, npm, build, API hoặc cơ sở dữ liệu bên ngoài. Font Be Vietnam Pro/Inter được tải từ Google Fonts khi có Internet; font dự phòng vẫn hiển thị nếu không tải được.

## Thông tin bán hàng / CTA

Các nút “Nhận tư vấn”, “Yêu cầu báo giá” đều dẫn về Google Form AN PHÁT:
https://docs.google.com/forms/d/e/1FAIpQLScSM56ZVHF-ZzfcVAm9LuB1AHoc5-35wcTRRTK-Qw1XIHQ1vQ/viewform

## Lưu ý trước khi chạy quảng cáo

- Tiêu đề đúng theo bản duyệt: **Kiểm soát ứng dụng chuyên sâu với DrayDPI hoàn toàn miễn phí trên DrayOS5 Vigor2928**.
- Số liệu và tính năng dựa trên tài liệu EC3 v5.5.0 được cung cấp; firmware thực tế có thể khác.
- Thông điệp **DPI hoàn toàn miễn phí** là thông điệp thương mại do bên bán hàng cung cấp. Cần xác nhận điều kiện kích hoạt / giấy phép và firmware áp dụng theo lô hàng, thị trường và thời điểm bán trước khi công bố chính thức.
- Hình marketing 3D đã được duyệt là hình minh họa, không dùng làm tài liệu nhận dạng cổng/kích thước phần cứng. Ảnh Vigor2928 riêng đã sử dụng ảnh sản phẩm người dùng cung cấp.
- App Route Policy hỗ trợ **3.368**, không phải toàn bộ 4.620 app. Các app chưa hỗ trợ App Service có thể cân nhắc cấu hình định tuyến theo Domain khi phù hợp.

## Kiểm tra nhanh

- Mở `index.html` trên Chrome/Edge và thử mục “Demo tương tác”.
- Tìm kiếm `Zoom` / `YouTube` trong danh sách ứng dụng.
- Trong demo, chọn `YouTube` + `App Route Policy` để xem cảnh báo hỗ trợ theo Domain.
- Xem trên màn hình nhỏ (menu mobile và bảng tra cứu có thể cuộn ngang trong vùng bảng).
