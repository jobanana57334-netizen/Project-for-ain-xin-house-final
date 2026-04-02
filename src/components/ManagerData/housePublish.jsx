import { useState,useEffect } from 'react';
import { useForm } from "react-hook-form";
import addJson from '../../assets/Manager/CityCountyData.json';
import { useDispatch } from 'react-redux';
import { showMessage } from '../../store/MessageSlice';
import { pUrl } from '../../utils/constants';
function HousePublish() {

  const dispatch= useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: {errors}
  } = useForm({
    defaultValues: {
      houseType: [],
      images: [],
      houseRules: [],
      furnishings: [],
      houseAge: '',
      rent: '',
      hoaFee: '',
      contactName: '',
      tel: ''
    },
    mode:'onTouched'
  });
  
  const onSubmit = async () => {
    try {
      // 這裡可以放置你的 API 請求邏輯，例如：
      // await api.post('/api/houses', data);

      // 成功時發送訊息
      dispatch(showMessage({
        type: 'success', // 假設你的 MessageSlice 支援這類屬性
        text: '屋件刊登資訊已成功儲存！'
      }));

      // 可選：送出成功後清空表單或導向其他頁面
      // reset(); 

    } catch (error) {
      console.error("送出失敗:", error);

      // 失敗時發送訊息
      dispatch(showMessage({
        type: 'error',
        text: '儲存失敗，請稍後再試或檢查網路連線。如有問題,請聯繫客服。'
      }));
    }
  };

  // 處理驗證失敗的狀態
  const onError = (errors) => {
    console.error("表單驗證錯誤:", errors);
    
    dispatch(showMessage({
      type: 'warning',
      text: '請檢查是否有漏填的必填項目（帶有 * 號的欄位）'
    }));
  };

  const HouseTitleInput = ({ register, errors, id, type, rules }) => {
    return (
      <>
        <div className="mb-24 mb-md-16">
          <label htmlFor={id} className="form-label body-2 text-gray-400">
            物件標題 <span className="body-2 text-system-accent">*</span>
          </label>
          <input
            type={type}
            id={id}
            placeholder="輸入物件標題"
            className={`form-control ${errors[id] ? 'is-invalid' : ''}`}
            {...register(id, rules)}
          />
          {errors[id] && (
            <div className="invalid-feedback">
              {errors[id]?.message || '請輸入物件標題'}
            </div>
          )}
        </div>
      </>
    );
  };

  const ImageUpload = ({ register, setValue, watch, id, rules }) => {
    const images = watch(id) || [];

    const handleFileChange = (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;
      const newImages = files.map((file) => ({
        file, 
        url: URL.createObjectURL(file), 
        id: Math.random().toString(36).substring(2, 9)
      }));
      setValue(id, [...images, ...newImages], { shouldValidate: true });
    };

    const removeImage = (imgId) => {
      const filteredImages = images.filter((img) => img.id !== imgId);
      setValue(id, filteredImages, { shouldValidate: true });
    };

    return (
      <div className='d-flex flex-wrap' style={{gap:"16px"}}>
        {images.map((img) => (
          <div key={img.id} className="image-upload ">
            <img src={img.url} alt="preview" className="upload-img" />
            <button 
              type="button" 
              className="delete-btn" 
              onClick={() => removeImage(img.id)}
            >
              <img src={`${pUrl}ManagerImages/delete.svg`} alt="img-delete" className="img-del" />
            </button>
          </div>
        ))}
        <label htmlFor={id} className="upload-box" style={{ cursor: 'pointer' }}>
          <img src={`${pUrl}ManagerImages/image-button.png`} alt="image-button" />
        </label>
        <input 
          type="file" 
          id={id} 
          multiple 
          accept="image/*" 
          className="d-none"
          onChange={handleFileChange}
        />
        <input 
          type="hidden" 
          {...register(id, rules)} 
        />
      </div>
    );
  };

  const HousePinInput = ({register,errors,id,type,rules}) =>{
    return(
      <div className="house-pin house-pin-md flex-fill">
        <label htmlFor={id} className="form-label body-2 text-gray-400">物件坪數 <span className="body-2 text-system-accent">*</span></label>
        <input 
          type={type}
          id={id} placeholder="物件坪數" 
          className={`form-control flex-fill ${errors[id] && 'is-invalid'}` }
          {...register(id, rules)}
        />
        {errors[id] && <div id="validationServerUsernameFeedback" className="invalid-feedback">請輸入物件坪數</div>} 
      </div>
    )
  }

  const HouseTotalPinInput = ({register,errors,id,type,rules}) =>{
    return(
      <div className="flex-fill">
        <label htmlFor={id} className="form-label body-2 text-gray-400">物件總坪數 <span className="body-2 text-system-accent">*</span></label>
        <input 
          type={type}
          id={id} placeholder="物件總坪數" 
          className={`form-control ${errors[id] && 'is-invalid'}` }
          {...register(id, rules)}
        />
        {errors[id] && <div id="validationServerUsernameFeedback" className="invalid-feedback">請輸入物件總坪數</div>} 
      </div>
    )
  }

  const HouseType = ({register,id,watch,setValue}) =>{
    const selectedType = watch(id);
    const handleSingleSelect = (value) => {
      setValue(id, value, { shouldValidate: true });
    };
    const types = ['整層住家','獨立套房','分租套房','雅房','商辦'];
    return(<>
      <div className="mb-24 mb-md-16">
        <label htmlFor={id} className="form-label body-2 text-gray-400">物件類型<span className="body-2 text-system-accent">*</span></label>
        <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
          <div className="btn-group single-select flex-wrap" role="group" aria-label="First group">
            {types.map((item) => (
              <button
                key={item}
                type="button"
                className={`btn me-8 mb-md-8 ${selectedType === item ? 'btn-outline-act' : 'btn-outline'}`}
                onClick={() => handleSingleSelect(item)}
              >
                {item}</button>
            ))}
          </div>
        </div>
        <input type="hidden" {...register(id)} />
      </div>
    </>)
  };

  const watchCity = watch("city");
  const [addressData, setAddressData] = useState([]);

  // 取得地址資料
  useEffect(() => {
    setAddressData(addJson);
  }, []);
  useEffect(() => {
    setValue("district", ""); // 當縣市改變，手動清空行政區
  }, [watchCity, setValue]);

  const SelectAdd = ({ id,register,errors,rules,children,disabled = false }) => {
    return (
      <>
        <select
          id={id}
          className={`form-select state-style ${errors[id] && 'is-invalid'}`}
          {...register(id, rules)}
          disabled={disabled}
        >
          { children }
        </select>
        {errors[id] && (
          <div className='invalid-feedback'>{errors[id]?.message}</div>
        )}
      </>
    )
  };

  const HouseRules = () =>{
    // 告訴 ESLint 忽略這行的相容性警告
    // eslint-disable-next-line react-hooks/incompatible-library
    const selectedRules = watch("houseRules");
    const rules = ['可開伙', '可養寵物', '不含管理費'];

    const handleToggle = (rule) => {
      const current = selectedRules || [];
      const newValues = current.includes(rule) ? current.filter((r)=> r !== rule)  : [...current, rule];            
      setValue("houseRules", newValues, { shouldValidate: true });
    };

    return (
      <div className="mb-24 mb-md-16">
        <label htmlFor="houseRules" className="form-label body-2 text-gray-400">其他 - 房屋守則</label>
        <input type="hidden" {...register("houseRules")} />
        <div className="btn-toolbar mb-3" role="toolbar">
          <div className="btn-group me-2" role="group">
            {rules.map((rule) => {
              const isActive = selectedRules.includes(rule);
              return (
                <button
                  key={rule}
                  type="button"
                  className={`btn me-8 ${isActive ? 'btn-outline-act' : 'btn-outline'}`}
                  onClick={() => handleToggle(rule)}
                >
                  {rule}</button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const Furnishings  = () =>{
    const selectedFurnishings = watch("furnishings");
    const things = ['電梯', '車位', '冰箱','桌椅','單人床','雙人床','對外窗','沙發','電視','衣櫃','網路','第四台','洗衣機','烘衣機','冷氣','熱水器'];

    const handleToggle = (thing) => {
      const current = selectedFurnishings || [];
      const newValues = current.includes(thing) ? current.filter((t)=> t !== thing)  : [...current, thing];            
      setValue("furnishings", newValues, { shouldValidate: true });
    };

    return (
      <div className="mb-24 mb-md-16">
        <label htmlFor="furnishings" className="form-label body-2 text-gray-400">其他 - 提供設備</label>
        <input type="hidden" {...register("furnishings")} />
        <div className="btn-toolbar mb-3" role="toolbar" aria-label="Toolbar with button groups">
          <div className="furnished-list me-2 d-flex flex-wrap" role="group" aria-label="First group">
            {things.map((thing) => {
              const isActive = selectedFurnishings.includes(thing);
              return (
                <button
                  key={thing}
                  type="button"
                  className={`btn me-8 mb-8 ${isActive ? 'btn-outline-act' : 'btn-outline'}`}
                  onClick={() => handleToggle(thing)}
                >
                  {thing}</button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  const HouseAge = ({ register, errors, id, rules }) => {
    const ages = ['0 - 5 年', '5 - 10 年', '10 - 20 年', '20 - 30 年', '30 年以上'];

    return (
      <div className="mb-24 mb-md-16">
        <label htmlFor={id} className="form-label body-2 text-gray-400">
          物件屋齡 <span className="body-2 text-system-accent">*</span>
        </label>
        <select 
          id={id} 
          className={`form-select ${errors[id] && 'is-invalid'}`}
          {...register(id, rules)}
        >
          <option value="">請選擇屋齡</option>
          {ages.map((age) => (
            <option key={age} value={age}>
              {age}
            </option>
          ))}
        </select>
        {/* 錯誤訊息提示 */}
        {errors[id] && (
          <div className="invalid-feedback">
            {errors[id]?.message || '請選擇屋齡'}
          </div>
        )}
      </div>
    );
  };

  const RentInput = ({register,errors,id,type,rules}) =>{
    return(
      <div className="mb-24 me-24 flex-fill mb-md-8 objectSqm-md-0">
        <label htmlFor={id} className="form-label body-2 text-gray-400">物件租金 (月) <span className="body-2 text-system-accent">*</span></label>
        <input 
          type={type}
          id={id} placeholder="輸入物件租金" 
          className={`form-control flex-fill ${errors[id] && 'is-invalid'}` }
          {...register(id, rules)}
        />
        {errors[id] && (
          <div className="invalid-feedback">
            {errors[id]?.message || '請輸入物件租金'}
          </div>
        )}
      </div>
    )
  };

  const HoaFeeInput = ({register,errors,id,type,rules}) =>{
    return(
      <div className="mb-24 flex-fill mb-md-0">
        <label htmlFor={id} className="form-label body-2 text-gray-400">物件管理費 <span className="body-2 text-system-accent">*</span></label>
        <input 
          type={type}
          id={id} placeholder="輸入物件管理費" 
          className={`form-control ${errors[id] && 'is-invalid'}` }
          {...register(id, rules)}
        />
        {errors[id] && (<div className="invalid-feedback">{errors[id]?.message || '請輸入物件管理費'}</div>)}
      </div>
    )
  };

  const NameInput = ({register,errors,id,type,rules}) =>{
    return(
      <div className="mb-24 flex-fill contact-name">
        <label htmlFor={id} className="form-label body-2 text-gray-400">聯絡人 <span className="body-2 text-system-accent">*</span></label>
        <input 
          type={type}
          id={id} placeholder="輸入聯絡人姓名" 
          className={`form-control flex-fill ${errors[id] && 'is-invalid'}` }
          {...register(id, rules)}
        />
        {errors[id] && (<div className="invalid-feedback">{errors[id]?.message || '請輸入聯絡人姓名'}</div>)}
      </div>
    )
  }

  const TelInput = ({register,errors,id,type,rules}) =>{
    return(
      <div className="mb-24 flex-fill mb-md-0">
        <label htmlFor={id} className="form-label body-2 text-gray-400">聯絡電話 <span className="body-2 text-system-accent">*</span></label>
        <input 
          type={type}
          id={id} placeholder="輸入聯絡電話" 
          className={`form-control flex-fill ${errors[id] && 'is-invalid'}` }
          {...register(id, rules)}
        />
        {errors[id] && (<div className="invalid-feedback">{errors[id]?.message || '請輸入聯絡電話'}</div>)}
      </div>
    )
  }


  return (

    <form className="ManagerHouse flex-fill" onSubmit={handleSubmit(onSubmit,onError)}>
      {/* 標題區塊 */}
      <div className="d-flex align-center mb-24 mb-md-40 mt-3">
        <p className="m-0 h5 text-gray-400">新刊登屋件</p>
      </div>
      {/* 表單內容白色背景區塊：縮小桌機版 padding，把空間還給內部表單欄位 */}
      <div className="bg-primary-white p-16 p-md-24 mb-24 mb-md-16 gap-4" style={{ borderRadius: '12px' }}>
        
        {/* 物件標題 */}
        <div>
          <HouseTitleInput
            register={register}
            errors={errors}
            id="houseTitle"
            type="text"
            rules={{ required:{ value:true, message:'請輸入物件標題' }}}
          />
        </div>
        
        {/* 物件類型 */}
        <div>
          <HouseType 
            id="houseType" 
            register={register} 
            watch={watch} 
            setValue={setValue} 
          />
        </div>

        {/* 物件坪數 */}
        <div className="d-flex flex-column flex-md-row gap-16 gap-md-24 mb-24 mb-md-16">
          <HousePinInput 
            register={register}
            errors={errors}
            id="housePin"
            type="text"
            rules={{ required:{ value:true, message:'請輸入物件坪數' }}}
          />
          <HouseTotalPinInput 
            register={register}
            errors={errors}
            id="houseTotalPin"
            type="text"
            rules={{ required:{ value:true, message:'請輸入物件總坪數' }}}
          />
        </div>

        {/* 物件圖片 */}
        <div className="mb-24 mb-md-16">
          <label htmlFor="formFile" className="form-label body-2 text-gray-400">
            物件圖片 <span className="body-2 text-system-accent">*</span>
          </label>

          <ImageUpload 
            id="images" 
            register={register} 
            setValue={setValue} 
            watch={watch} 
            rules={{ 
              required: '請至少上傳一張圖片',
              validate: (value) => value.length <= 5 || '最多只能上傳 5 張圖片'
            }}
          />
        </div>

        {/* 物件地址 */}
        <div className='mb-24 mb-md-16'>
          <label htmlFor="city" className="form-label body-2 text-gray-400">物件地址 <span className="body-2 text-system-accent">*</span></label>
          <div className="d-flex flex-wrap gap-16 address-row">
            {/* ... 地址 Select 保持不變 ... */}
            <SelectAdd id='city' labelText='縣市' errors={errors} register={register} rules={{ required: '縣市為必填' }}>
              <option value="">縣市</option>
              {addressData.map((city) => (
                <option value={city.CityName} key={city.CityEngName}>{city.CityName}</option>
              ))}
            </SelectAdd>
            <SelectAdd id='district' labelText='鄉鎮市區' errors={errors} register={register} disabled={!watchCity} rules={{ required: '鄉鎮市區為必填' }}>
              <option value="">地區</option>
              {addressData.find((city) => city.CityName === watchCity)?.AreaList?.map((area) => (
                <option value={area.AreaName} key={area.ZipCode}>{area.AreaName}</option>
              ))}
            </SelectAdd>
            <input type="text" className="form-control address-style flex-fill" id="inputAddress" placeholder="輸入完整地址" required />
          </div>
        </div>

        {/* 房屋守則 */}
        <HouseRules />
        
        {/* 提供設備 */}
        <Furnishings />
        
        {/* 物件屋齡 */}
        <HouseAge
          id="houseAge"
          register={register}
          errors={errors}
          rules={{ required: '物件屋齡為必填項目' }}
        />

        {/* 物件租金、管理費：加入 gap-16，讓手機版上下排列時不會黏在一起 */}
        <div className="d-flex flex-column flex-md-row gap-16 gap-md-24 mb-24 mb-md-16">
          <RentInput
            register={register}
            errors={errors}
            id="rent"
            type="number"
            rules={{ required:{ value:true, message:'請輸入物件租金' }}}
          />
          <HoaFeeInput
            register={register}
            errors={errors}
            id="hoaFee"
            type="number"
            rules={{ required:{ value:true, message:'請輸入物件管理費' }}}
          />
        </div>

        {/* 聯絡人、聯絡電話：加入 gap-16 */}
        <div className="d-flex flex-column flex-md-row gap-16 gap-md-24 mb-24 mb-md-16">
          <NameInput 
            register={register}
            errors={errors}
            id="contactName"
            type="text"
            rules={{ required:{ value:true, message:'請輸入聯絡人姓名' }}}
          />
          <TelInput 
            register={register}
            errors={errors}
            id="tel"
            type="tel"
            rules={{ required:{ value:true, message:'請輸入聯絡電話' }}}
          />
        </div>

      </div> {/* 白色背景區塊結束 */}

      {/* 儲存按鈕：用 d-flex 容器包起來。桌機版靠右 (justify-md-end)，手機版滿版且置中 (justify-center) */}
      <div className="d-flex justify-center justify-md-end pb-48">
        <button 
          type="submit" 
          // w-100 代表手機版時寬度 100% (滿版)，w-md-auto 代表桌機版恢復原本按鈕大小
          className="btn addHouses-btn h6 text-primary-500 m-0 w-100 w-md-auto d-flex justify-center align-center"
        >
          儲存刊登屋件資訊
          <img src={`${pUrl}ManagerImages/Icons-correct.svg`} alt="Icons-correct" className="ms-16" />
        </button>
      </div>
      
    </form>
  );
}

export default HousePublish;