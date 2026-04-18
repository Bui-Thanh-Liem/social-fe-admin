import { REGEXP_ONLY_DIGITS } from "input-otp";
import { ArrowLeft, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useActive2Fa, useSetup2Fa } from "~/apis/auth.api";
import { Logo } from "~/components/logo";
import { Button } from "~/components/ui/button";
import { Field, FieldLabel } from "~/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { Label } from "~/components/ui/label";
import { WrapIcon } from "~/components/wrap-icon";
import type { ResActive2Fa } from "~/shared/dtos/res/auth.dto";
import { handleResponse } from "~/utils/toast.util";

export function Setup2FaPage() {
  const apiSetup2Fa = useSetup2Fa();
  const apiActive2Fa = useActive2Fa();
  const [urlCode, setUrlCode] = useState("");
  const [resActive, setResActive] = useState<ResActive2Fa | null>();
  const navigate = useNavigate();

  //
  const [params] = useSearchParams();
  const admin_id = params.get("admin_id") || "";

  //
  useEffect(() => {
    if (admin_id) {
      console.log("apiSetup2Fa", admin_id);

      apiSetup2Fa
        .mutateAsync({
          _id: admin_id,
        })
        .then((res) => {
          if (res.statusCode === 200 && res.metadata) {
            setUrlCode(res.metadata.qrCodeUrl);
          }
          handleResponse(res);
        });
    }
  }, [admin_id]);

  //
  function onSubmit(value: string) {
    // Gửi token OTP mà admin nhập vào để kích hoạt 2FA
    if (value.length !== 6) {
      return;
    }
    apiActive2Fa.mutateAsync({ token: value, _id: admin_id }).then((res) => {
      if (res.statusCode === 200) setResActive(res.metadata);
      handleResponse(res);
    });
  }

  //
  return (
    <div className="m-auto flex items-center gap-x-48">
      <div className="flex gap-x-3">
        {!resActive?.backupSecret && (
          <Field className="w-fit space-y-3">
            <FieldLabel htmlFor="digits-only">
              Cài đặt ứng dụng{" "}
              <a
                target="_blank"
                className="underline"
                href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&pcampaignid=web_share"
              >
                Google Authenticator
              </a>
            </FieldLabel>
            {urlCode && (
              <img src={urlCode} alt="QR CODE" className="border rounded-xl" />
            )}

            <div className="flex items-center gap-x-3">
              <WrapIcon onClick={() => navigate(-1)}>
                <ArrowLeft />
              </WrapIcon>
              <InputOTP
                maxLength={6}
                id="digits-only"
                disabled={!urlCode}
                onChange={onSubmit}
                pattern={REGEXP_ONLY_DIGITS}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </Field>
        )}
        {resActive?.two_factor_enabled && (
          <div className="space-y-6">
            <Label className="text-gray-500">
              Mã dự phòng chỉ hiển thị một lần này, sử dụng khi không có thiết
              bị tạm thời, tối đa 5 lần sử dụng.
            </Label>
            <ul className="mb-6 list-disc [&>li]:mt-2">
              {resActive.backupSecret.map((m, i) => (
                <li key={`${m.used_at}-${i}`} className="flex items-center">
                  {Array.from({ length: m.secret.length }, () => "*")}
                  <WrapIcon>
                    <Copy size={20} color="gray" />
                  </WrapIcon>
                </li>
              ))}
            </ul>
            <Button
              type="submit"
              size="lg"
              className="w-full"
              onClick={() => {
                navigate("/login");
              }}
            >
              Tiếp theo
            </Button>
          </div>
        )}
      </div>
      <Logo size={400} />
    </div>
  );
}
