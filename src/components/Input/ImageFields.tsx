import { Card, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

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
  const hasMultipleImages = detailPreviews.length > 1;
  return (
    <div className="w-fulld">
      <FieldGroup>
        <Field>
          <FieldLabel>썸네일 이미지</FieldLabel>
          <Input type="file" accept="image/*" onChange={onThumbnailChange} />
          {thumbnailPreview && (
            <img src={thumbnailPreview} className="w-32 mt-2" />
          )}
        </Field>
        <Field>
          <FieldLabel>상세 이미지</FieldLabel>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={onDetailsChange}
          />
          {hasMultipleImages && (
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
            >
              <CarouselContent>
                {detailPreviews.map((src, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="p-1">
                      <Card className="overflow-hidden">
                        <CardContent className="flex aspect-square items-center justify-center p-0 ">
                          <img
                            src={src}
                            alt={`preview-${index}`}
                            className="w-full h-full"
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious type="button" />
              <CarouselNext type="button" />
            </Carousel>
          )}
        </Field>
      </FieldGroup>
    </div>
  );
};

export default ImageFields;
