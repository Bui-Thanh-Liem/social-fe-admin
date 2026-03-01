import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useActive2Fa, useSetup2Fa } from "~/apis/auth.api";
import { Card, CardContent } from "~/components/ui/card";
import { Field, FieldLabel } from "~/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { handleResponse } from "~/utils/toast";

export function Setup2FaPage() {
  const apiSetup2Fa = useSetup2Fa();
  const apiActive2Fa = useActive2Fa();
  const [urlCode, setUrlCode] = useState("");

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
  }, []);

  //
  function onSubmit(value: string) {
    // Gửi token OTP mà admin nhập vào để kích hoạt 2FA
    if (value.length !== 6) {
      return;
    }
    apiActive2Fa.mutateAsync({ token: value, _id: admin_id }).then((res) => {
      handleResponse(res);
    });
  }

  return (
    <Card className="m-auto">
      <CardContent>
        Setup 2FA for admin_id: {admin_id}
        <img src={urlCode} alt="QR CODE" />
        <Field className="w-fit">
          <FieldLabel htmlFor="digits-only">Digits Only</FieldLabel>
          <InputOTP
            maxLength={6}
            id="digits-only"
            pattern={REGEXP_ONLY_DIGITS}
            onChange={onSubmit}
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
        </Field>
      </CardContent>
    </Card>
  );
}
