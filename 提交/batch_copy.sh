#!/bin/bash

# 批量复制各项目的提交.txt文件到提交文件夹，并按项目文件夹名重命名
# 作者: Auto
# 日期: 2026-01-19

# 项目根目录
PROJECT_ROOT="./"
# 目标文件夹
TARGET_DIR="${PROJECT_ROOT}/提交"

# 确保目标文件夹存在
mkdir -p "${TARGET_DIR}"

echo "=========================================="
echo "开始扫描并复制提交文件..."
echo "=========================================="
echo ""

# 计数器
count_success=0
count_skip=0
count_error=0

# 遍历项目根目录下的所有子文件夹
for dir in "${PROJECT_ROOT}"/U-*/; do
    # 检查目录是否存在
    if [ ! -d "$dir" ]; then
        continue
    fi

    # 获取文件夹名称（去除路径末尾的 /）
    folder_name=$(basename "$dir")

    # 跳过提交文件夹本身（如果它符合 U-* 模式）
    if [ "$folder_name" = "提交" ]; then
        continue
    fi

    # 检查提交.txt文件是否存在
    submission_file="${dir}提交.txt"
    if [ -f "$submission_file" ]; then
        # 目标文件路径
        target_file="${TARGET_DIR}/${folder_name}.txt"

        # 复制文件
        if cp "$submission_file" "$target_file"; then
            echo "✓ ${folder_name}/提交.txt -> ${TARGET_DIR}/${folder_name}.txt"
            ((count_success++))
        else
            echo "✗ ${folder_name}/提交.txt 复制失败"
            ((count_error++))
        fi
    else
        echo "⚠ ${folder_name}/提交.txt 文件不存在，跳过"
        ((count_skip++))
    fi
done

echo ""
echo "=========================================="
echo "执行完成！"
echo "=========================================="
echo "成功: $count_success 个文件"
echo "跳过: $count_skip 个文件（提交.txt不存在）"
echo "失败: $count_error 个文件"
echo ""
echo "所有文件已保存到: ${TARGET_DIR}"
echo "=========================================="
