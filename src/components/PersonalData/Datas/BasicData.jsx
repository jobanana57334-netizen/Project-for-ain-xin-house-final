import { useState, useRef } from 'react';
import userIcon from '../../../icons/home/user-icon.svg';
import { storage } from '../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useForm } from 'react-hook-form';
import DatePicker, { registerLocale } from "react-datepicker";
import { getAuth } from 'firebase/auth';
import "react-datepicker/dist/react-datepicker.css";
import { zhTW } from 'date-fns/locale';
import { Controller } from "react-hook-form";
import AvatarEditor from 'react-avatar-editor';
import { useDispatch } from 'react-redux';
import { showMessage } from '../../../store/MessageSlice';

registerLocale('zh-TW', zhTW);

const BasicData = ({ initialData, updateData }) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    values: {
      img: initialData?.img || userIcon,
      name: initialData?.name || '請輸入姓名',
      birthday: initialData?.birthday || 'YYYY-MM-DD',
      gender: initialData?.gender || '選擇性別'
    }
  });

  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [scale, setScale] = useState(1.2);
  const [isUploading, setIsUploading] = useState(false);
  const editorRef = useRef(null);

  const handleImgChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImg(e.target.files[0]);
    }
  };

  const onSubmit = async (data) => {
    setIsUploading(true);
    let newAvatarUrl = initialData?.img;

    try {
      if (selectedImg && editorRef.current) {
        const canvas = editorRef.current.getImageScaledToCanvas();
        const blob = await new Promise((resolve) => {
          canvas.toBlob((b) => resolve(b), 'image/jpeg');
        });

        const auth = getAuth();
        const userId = auth.currentUser.uid;
        const storageRef = ref(storage, `userAvatars/${userId}.jpg`);

        await uploadBytes(storageRef, blob);
        newAvatarUrl = await getDownloadURL(storageRef);
      }

      const finalData = {
        ...data,
        img: newAvatarUrl
      };

      const isSuccess = await updateData(finalData);
      if (isSuccess) {
        setIsEditing(false);
        setSelectedImg(null);
      }
    } catch (error) {
      console.error("圖片上傳失敗：", error);
      dispatch(showMessage({
        type: "error",
        text: "圖片處理發生錯誤，請稍後再試！"
      }));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="card border mb-4" style={{ borderRadius: '16px' }}>
      <div className="card-body p-0">
        {/* 標題區塊 */}
        <div className="p-4 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
          <div className="mb-3 mb-md-0">
            <h4 className="card-title fw-normal mb-1">基本資訊</h4>
            <p className="card-text text-muted small mb-0">部分資訊可能會顯示在使用此平台的其他用戶面前。</p>
          </div>
          <div className="d-flex gap-2 align-self-end align-self-md-between">
            {isEditing && (
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm px-4"
                disabled={isUploading}
                onClick={() => {
                  setIsEditing(false);
                  setSelectedImg(null);
                }}
              >
                取消
              </button>
            )}
            <button
              type="button"
              className={`btn ${isEditing ? 'btn-primary' : 'btn-outline-primary'} btn-sm px-4`}
              disabled={isUploading}
              onClick={isEditing ? handleSubmit(onSubmit) : () => setIsEditing(true)}
            >
              {isUploading ? '上傳儲存中...' : (isEditing ? '儲存' : '編輯')}
            </button>
          </div>
        </div>

        {/* 個人相片 */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center px-4 py-3 border-bottom action-row">
          <div className="text-muted fw-bold fw-md-normal mb-2 mb-md-0" style={{ minWidth: '120px' }}>個人相片</div>
          <div className="flex-grow-1 text-muted small w-100">
            {!isEditing && (initialData?.img ? "按下編輯即可更改圖片" : "新增相片即可個人化你的帳戶")}
          </div>
          <div className="flex-shrink-0 ms-0 ms-md-3 mt-3 mt-md-0 align-self-center">
            {isEditing ? (
              <>
                <input
                  type="file"
                  accept="image/*"
                  className={`form-control ${errors.img ? 'is-invalid' : ''}`}
                  onChange={handleImgChange}
                />
                {selectedImg && (
                  <div className="text-center mt-2 border rounded p-2 bg-light">
                    <AvatarEditor
                      ref={editorRef}
                      image={selectedImg}
                      width={150}
                      height={150}
                      border={10}
                      borderRadius={75}
                      color={[255, 255, 255, 0.6]}
                      scale={scale}
                    />
                    <input
                      type="range"
                      min="1"
                      max="2"
                      step="0.01"
                      value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      className="form-range mt-2"
                    />
                    <small className="text-muted d-block">拖曳圖片調整位置，拉桿調整大小</small>
                  </div>
                )}
              </>
            ) : (
              <img
                src={initialData?.img || userIcon}
                alt="Profile"
                className="rounded-circle object-fit-cover"
                style={{ width: '60px', height: '60px' }}
              />
            )}
          </div>
        </div>

        {/* 名稱 */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center px-4 py-3 border-bottom action-row">
          <div className="text-muted fw-bold fw-md-normal mb-2 mb-md-0" style={{ minWidth: '120px' }}>名稱</div>
          <div className="flex-grow-1 w-100">
            {isEditing ? (
              <>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  {...register('name', { required: "姓名名稱為必填!" })}
                />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </>
            ) : (
              <span className="fw-medium text-dark">{initialData?.name || '尚未設定'}</span>
            )}
          </div>
        </div>

        {/* 生日 */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center px-4 py-3 border-bottom action-row">
          <div className="text-muted fw-bold fw-md-normal mb-2 mb-md-0" style={{ minWidth: '120px' }}>生日</div>
          <div className="flex-grow-1 w-100">
            {isEditing ? (
              <>
                <div className="input-group">
                  <span className="input-group-text bg-white text-muted">
                    <i className="bi bi-calendar-date"></i>
                  </span>
                  <Controller
                    control={control}
                    name="birthday"
                    rules={{
                      required: "出生年月日為必填!",
                      validate: {
                        isAdult: (value) => {
                          if (!value || value === 'YYYY-MM-DD') return true;
                          const selectedDate = new Date(value);
                          const today = new Date();
                          const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
                          return selectedDate <= eighteenYearsAgo || "您必須年滿 18 歲才能使用本服務喔！";
                        }
                      }
                    }}
                    render={({ field: { onChange, value } }) => {
                      const isValidDate = value && value !== 'YYYY-MM-DD' && !isNaN(new Date(value).getTime());
                      return (
                        <DatePicker
                          selected={isValidDate ? new Date(value) : null}
                          onChange={(date) => {
                            if (date) {
                              const year = date.getFullYear();
                              const month = String(date.getMonth() + 1).padStart(2, '0');
                              const day = String(date.getDate()).padStart(2, '0');
                              onChange(`${year}-${month}-${day}`);
                            } else {
                              onChange('');
                            }
                          }}
                          locale="zh-TW"
                          dateFormat="yyyy-MM-dd"
                          className={`form-control ${errors.birthday ? 'is-invalid' : ''}`}
                          placeholderText="請選擇出生年月日"
                          showYearDropdown
                          showMonthDropdown
                          dropdownMode="select"
                          maxDate={new Date()}
                        />
                      );
                    }}
                  />
                </div>
                {errors.birthday && <div className="invalid-feedback d-block mt-1">{errors.birthday.message}</div>}
              </>
            ) : (
              <span className="fw-medium text-dark">{initialData?.birthday || '尚未設定'}</span>
            )}
          </div>
        </div>

        {/* 性別 */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center px-4 py-3 action-row">
          <div className="text-muted fw-bold fw-md-normal mb-2 mb-md-0" style={{ minWidth: '120px' }}>性別</div>
          <div className="flex-grow-1 w-100">
            {isEditing ? (
              <>
                <select
                  className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
                  {...register('gender', {
                    required: "性別為必填!",
                    validate: (value) => ['男性', '女性', '不公開'].includes(value) || '請選擇有效的性別'
                  })}
                >
                  <option value="" disabled>請選擇性別</option>
                  <option value="男性">男性</option>
                  <option value="女性">女性</option>
                  <option value="不公開">不公開</option>
                </select>
                {errors.gender && <div className="invalid-feedback">{errors.gender.message}</div>}
              </>
            ) : (
              <span className="fw-medium text-dark">{initialData?.gender || '尚未設定'}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicData;