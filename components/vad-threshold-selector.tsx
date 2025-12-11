"use client";

import * as React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { ConfigurationFormFieldProps } from "@/components/configuration-form";
import { Input } from "@/components/ui/input";

// ✅ Define min/max constants for VAD Threshold
const MIN_VAD_THRESHOLD = 0.0; // minimum value
const MAX_VAD_THRESHOLD = 1.0; // maximum value

export function VadThresholdSelector({
  form,
  ...props
}: ConfigurationFormFieldProps) {
  const [isHovered, setIsHovered] = React.useState<boolean>(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FormField
        control={form.control}
        name="vadThreshold"
        render={({ field }) => (
          <HoverCard openDelay={200}>
            <HoverCardTrigger asChild>
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm">Threshold</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className={`shadow-none font-light py-0 h-8 max-w-[100px] text-right ${
                        isHovered ? " border" : " border-none"
                      }`}
                    />
                  </FormControl>
                </div>

                <FormControl>
                  <Slider
                    min={MIN_VAD_THRESHOLD}
                    max={MAX_VAD_THRESHOLD}
                    step={0.1}
                    defaultValue={[form.formState.defaultValues!.vadThreshold!]}
                    value={[field.value]}
                    onValueChange={(v) => field.onChange(v[0])}
                    className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                    aria-label="VAD Threshold"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            </HoverCardTrigger>

            <HoverCardContent
              align="start"
              className="w-[260px] text-sm"
              side="bottom"
            >
              Activation threshold for Server VAD
            </HoverCardContent>
          </HoverCard>
        )}
      />
    </div>
  );
}
