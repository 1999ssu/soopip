//이미지(파일업로드용) 전용 UI
interface Props {
  thumbnailPreview: string | null;
  onThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  detailPreviews: string[];
  onDetailsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageFields = ({
  thumbnailPreview,
  onThumbnailChange,
  detailPreviews,
  onDetailsChange,
}: Props) => {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <label>썸네일 이미지</label>
        <input type="file" accept="image/*" onChange={onThumbnailChange} />
        {thumbnailPreview && (
          <img src={thumbnailPreview} className="w-32 mt-2" />
        )}
      </div>

      <div>
        <label>상세 이미지 (여러 장)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onDetailsChange}
        />

        <div className="flex gap-2 flex-wrap mt-2">
          {detailPreviews.map((src, i) => (
            <img key={i} src={src} className="w-24" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageFields;
