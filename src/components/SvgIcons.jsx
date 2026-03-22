import React from 'react';

const SvgIcon = ({ 
    name, 
    prefix = 'icon', 
    color = 'currentColor', 
    width = '1em', 
    height = '1em', 
    className = '',
    isPublic = false // 🌟 新增這個開關，預設為 false (不影響原本的寫法)
}) => {
    
    // ==========================================
    // 模式 A：我們新加的 Public Mask 模式 (適合放在 public 資料夾的圖片)
    // ==========================================
    if (isPublic) {
        // 假設圖片放在 public/ManagerImages/
        const imgUrl = `/ManagerImages/${name}.svg`;
        return (
            <span
                className={className}
                aria-hidden="true"
                style={{
                    display: 'inline-block',
                    width: width,
                    height: height,
                    backgroundColor: color, // 控制顏色
                    WebkitMaskImage: `url(${imgUrl})`,
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskImage: `url(${imgUrl})`,
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                }}
            />
        );
    }

    // ==========================================
    // 模式 B：原作者的 SVG Sprite 模式 (完全保留，保證不衝突)
    // ==========================================
    const symbolId = `#${prefix}-${name}`;
    return (
        <svg 
            width={width} 
            height={height} 
            className={className} 
            aria-hidden="true"
            style={{ fill: color, color: color }}
        >
            <use href={symbolId} />
        </svg>
    );
};

export default SvgIcon;