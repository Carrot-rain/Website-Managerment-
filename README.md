# Website Manager

A management system for creating, backing up, editing and publishing static websites.

## Structure

- admin-web: React administration frontend
- backend: FastAPI management backend
- site-renderer: Static website renderer
- storage: Runtime website data and backups
- docs: Project documentation

  ## instruction
- 目前还没有docker化，下载后进入backend文件夹
- 创建虚拟环境 py -3.14 -m venv .venv
- 激活虚拟环境 .venv\Scripts\activate
- 安装uvicorn和fastapi python -m pip install fastapi uvicorn
- 安装依赖 进admin-web npm install
- 即可
