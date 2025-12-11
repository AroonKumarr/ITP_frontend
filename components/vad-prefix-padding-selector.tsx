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

// ✅ Define min/max constants for VAD prefix padding
const MIN_PREFIX_PADDING = 0;   // minimum value in ms
const MAX_PREFIX_PADDING = 500; // maximum value in ms

export function VadPrefixPaddingSelector({
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
        name="vadPrefixPaddingMs"
        render={({ field }) => (
          <HoverCard openDelay={200}>
            <HoverCardTrigger asChild>
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm">Prefix Padding (ms)</FormLabel>
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
                    min={MIN_PREFIX_PADDING}
                    max={MAX_PREFIX_PADDING}
                    step={10}
                    defaultValue={[form.formState.defaultValues!.vadPrefixPaddingMs!]}
                    value={[field.value]}
                    onValueChange={(v) => field.onChange(v[0])}
                    className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                    aria-label="VAD Prefix Padding"
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
              How much audio to include in the audio stream before the speaking activation.
            </HoverCardContent>
          </HoverCard>
        )}
      />
    </div>
  );
}
