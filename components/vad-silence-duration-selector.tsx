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

// ✅ Define min/max constants for VAD Silence Duration
const MIN_SILENCE_DURATION = 0;   // minimum value in ms
const MAX_SILENCE_DURATION = 1000; // maximum value in ms

export function VadSilenceDurationSelector({
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
        name="vadSilenceDurationMs"
        render={({ field }) => (
          <HoverCard openDelay={200}>
            <HoverCardTrigger asChild>
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm">
                    Silence Duration (ms)
                  </FormLabel>
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
                    min={MIN_SILENCE_DURATION}
                    max={MAX_SILENCE_DURATION}
                    step={10}
                    defaultValue={[
                      form.formState.defaultValues!.vadSilenceDurationMs!,
                    ]}
                    value={[field.value]}
                    onValueChange={(v) => field.onChange(v[0])}
                    className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                    aria-label="VAD Silence Duration"
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
              How long to wait to mark the speaking as concluded.
            </HoverCardContent>
          </HoverCard>
        )}
      />
    </div>
  );
}
