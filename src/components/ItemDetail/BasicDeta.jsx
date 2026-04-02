const BasicDeta = ({houseData}) => {
    

  const hasParking = houseData?.equipmentIds?.includes(2);
  const managerPriceDisplay= houseData?.managerPrice>0?
    `$${houseData?.managerPrice.toLocaleString()} / 月`:
    '無'


  return (
    <>
      <section className="mb-5">
        {/* 標題左側橘色邊框 */}
        <h3 className="fs-5 fw-bold mb-4 ps-3 border-start border-4 border-warning">
          基本資料
        </h3>
                
        {/* 💡 外層：專心負責卡片的白底、圓角、邊框與內距 */}
        <div className="bg-white p-0 p-md-4 rounded-3 border border-light mt-3">
                    
          {/* 上半部：5 個欄位 (改用 row-cols-md-5) */}
          <div className="row row-cols-2 row-cols-md-5 gy-3">
            <div className="col">
              <p className="text-secondary small mb-1">總坪數</p>
              <p className="fw-semibold mb-0">{houseData?.size || "找不到資料"} 坪</p>
            </div>
            <div className="col">
              <p className="text-secondary small mb-1">主坪數</p>
              <p className="fw-semibold mb-0">{houseData?.mainSize||"找不到資料"} 坪</p>
            </div>
            <div className="col">
              <p className="text-secondary small mb-1">公共設施</p>
              <p className="fw-semibold mb-0">{houseData?.publicSize||"找不到資料"} 坪</p>
            </div>
            <div className="col">
              <p className="text-secondary small mb-1">土地坪數</p>
              <p className="fw-semibold mb-0">{houseData?.landSize||"找不到資料"} 坪</p>
            </div>
            <div className="col">
              <p className="text-secondary small mb-1">車位</p>
              <p className="fw-semibold mb-0">{hasParking?"有":"無"}</p>
            </div>
          </div>

          {/* 💡 中間分隔線：完美重現截圖中的灰色線條 */}
          <hr className="text-secondary opacity-25 my-4" />

          {/* 下半部：剩餘的欄位 */}
          <div className="row row-cols-2 row-cols-md-5 gy-3 mb-4">
            <div className="col">
              <p className="text-secondary small mb-1">管理費</p>
              <p className="fw-semibold mb-0">{managerPriceDisplay}</p>
            </div>
            <div className="col">
              <p className="text-secondary small mb-1">法定用途</p>
              <p className="fw-semibold mb-0">{houseData?.typeName||"找不到資料"}</p>
            </div>
          </div>

          {/* 提示文字區塊：因為放在 row 外面，所以不需要 col-12 了，它自然會佔滿 100% */}
          <p className="text-secondary mb-0" style={{ fontSize: '13px' }}>
            ＊上述各項面積合計係依地政機關登記簿 登載的面積總合(平方公尺)換算為坪所得。 
            (1平方公尺=0.3025坪，小數點第三位四捨五入後取二位)
          </p>

        </div>
      </section>
    </>
  )
}

export default BasicDeta;