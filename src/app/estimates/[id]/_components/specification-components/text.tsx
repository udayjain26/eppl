'use client'

import MySep from '@/app/_components/custom-sep'
import { laminations } from '@/app/settings/constants'
import { paperTypes } from '@/app/settings/paper-constants'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { PaperData } from '@/server/paper/types'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { set } from 'date-fns'
import { CheckIcon } from 'lucide-react'
import React from 'react'
import { ChangeEvent, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

export default function Text(props: {
  control: any
  form: UseFormReturn
  paperData: PaperData[]
}) {
  const [openLamination, setOpenLamination] = React.useState(false)
  const [openPaperType, setOpenPaperType] = React.useState(false)
  const [openSecondaryLamination, setOpenSecondaryLamination] =
    React.useState(false)
  const [openSecondaryPaperType, setOpenSecondaryPaperType] =
    React.useState(false)

  const [openInsertLamination, setOpenInsertLamination] = React.useState(false)
  const [openInsertPaperType, setOpenInsertPaperType] = React.useState(false)

  // const [openPaper, setOpenPaper] = React.useState(false)
  // const [selectedPaper, setSelectedPaper] = useState<PaperData | null>(null)

  return (
    <div className="flex  flex-col pt-4">
      <h1 className="">Text Details</h1>
      <div className="flex flex-row gap-x-1">
        <div className="flex flex-col">
          {' '}
          <FormField
            control={props.control}
            name="textColors"
            render={({ field }) => (
              <FormItem className="w-16">
                <FormLabel>#Colors</FormLabel>
                <FormControl>
                  <Input {...field}></Input>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col">
          {' '}
          <FormField
            control={props.control}
            name="textPages"
            render={({ field }) => (
              <FormItem className="w-16">
                <FormLabel>#Pages</FormLabel>
                <FormControl>
                  <Input {...field}></Input>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col">
          {' '}
          <FormField
            control={props.control}
            name="textLamination"
            render={({ field }) => (
              <FormItem
                className="flex flex-col 
           gap-y-1 pt-[6px]"
              >
                <FormLabel>Text Lamination</FormLabel>

                <Popover open={openLamination} onOpenChange={setOpenLamination}>
                  <PopoverTrigger className="" asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openLamination}
                      className="w-48 justify-between"
                    >
                      <input
                        type="hidden"
                        {...field}
                        value={field.value ? field.value : ''}
                      />
                      {field.value
                        ? laminations.find((size) => size.label === field.value)
                            ?.label
                        : 'Select lamination...'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search laminations..."
                        className="h-10"
                      />
                      <CommandEmpty>No lamination found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {laminations.map((lam) => (
                            <CommandItem
                              key={lam.label}
                              value={lam.label}
                              onSelect={() => {
                                props.form.setValue('textLamination', lam.label)
                                field.onChange(lam.label)
                                props.form.trigger('textLamination') // Trigger form validation and state update

                                setOpenLamination(false)
                              }}
                            >
                              {lam.label}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  field.value === lam.label
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="flex flex-row gap-x-1">
        <FormField
          control={props.control}
          name="textGrammage"
          render={({ field }) => (
            <FormItem className="w-20">
              <FormLabel>Paper GSM</FormLabel>
              <FormControl>
                <Input {...field}></Input>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={props.control}
          name="textPaperType"
          render={({ field }) => (
            <FormItem
              className="flex flex-col 
           gap-y-1 pt-[6px]"
            >
              <FormLabel>Text Paper Type</FormLabel>

              <Popover open={openPaperType} onOpenChange={setOpenPaperType}>
                <PopoverTrigger className="" asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openPaperType}
                    className="w-56 justify-between"
                  >
                    <input
                      type="hidden"
                      {...field}
                      value={field.value ? field.value : ''}
                    />
                    {field.value
                      ? paperTypes.find((type) => type.label === field.value)
                          ?.label
                      : 'Select paper type...'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search paper types..."
                      className="h-10"
                    />
                    <CommandEmpty>No paper type found.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {paperTypes.map((type) => (
                          <CommandItem
                            key={type.label}
                            value={type.label}
                            onSelect={() => {
                              props.form.setValue('textPaperType', type.label)
                              field.onChange(type.label)
                              props.form.trigger('textPaperType') // Trigger form validation and state update

                              setOpenPaperType(false)
                            }}
                          >
                            {type.label}
                            <CheckIcon
                              className={cn(
                                'ml-auto h-4 w-4',
                                field.value === type.label
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
      </div>
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue={
          props.form.getValues('secondaryTextPages') ||
          props.form.getValues('secondaryTextColors') ||
          props.form.getValues('secondaryTextLamination') ||
          props.form.getValues('secondaryTextGrammage') ||
          props.form.getValues('secondaryTextPaperType')
            ? 'secondary fields'
            : undefined
        }
      >
        <AccordionItem value="secondary fields">
          <AccordionTrigger>Add Secondary Text</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-y-2 p-1">
            <div className="flex flex-row gap-x-1">
              <div className="flex flex-col">
                {' '}
                <FormField
                  control={props.control}
                  name="secondaryTextColors"
                  render={({ field }) => (
                    <FormItem className="w-16">
                      <FormLabel>#Colors</FormLabel>
                      <FormControl>
                        <Input {...field}></Input>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col">
                {' '}
                <FormField
                  control={props.control}
                  name="secondaryTextPages"
                  render={({ field }) => (
                    <FormItem className="w-16">
                      <FormLabel>#Pages</FormLabel>
                      <FormControl>
                        <Input {...field}></Input>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col">
                {' '}
                <FormField
                  control={props.control}
                  name="secondaryTextLamination"
                  render={({ field }) => (
                    <FormItem
                      className="flex flex-col 
           gap-y-1 pt-[6px]"
                    >
                      <FormLabel>Secondary Text Lamination</FormLabel>

                      <Popover
                        open={openSecondaryLamination}
                        onOpenChange={setOpenSecondaryLamination}
                      >
                        <PopoverTrigger className="" asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openSecondaryLamination}
                            className="w-48 justify-between"
                          >
                            <input
                              type="hidden"
                              {...field}
                              value={field.value ? field.value : ''}
                            />
                            {field.value
                              ? laminations.find(
                                  (size) => size.label === field.value,
                                )?.label
                              : 'Select lamination...'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search laminations..."
                              className="h-10"
                            />
                            <CommandEmpty>No lamination found.</CommandEmpty>
                            <CommandGroup>
                              <CommandList>
                                {laminations.map((lam) => (
                                  <CommandItem
                                    key={lam.label}
                                    value={lam.label}
                                    onSelect={() => {
                                      props.form.setValue(
                                        'secondaryTextLamination',
                                        lam.label,
                                      )
                                      field.onChange(lam.label)
                                      props.form.trigger(
                                        'secondaryTextLamination',
                                      ) // Trigger form validation and state update

                                      setOpenSecondaryLamination(false)
                                    }}
                                  >
                                    {lam.label}
                                    <CheckIcon
                                      className={cn(
                                        'ml-auto h-4 w-4',
                                        field.value === lam.label
                                          ? 'opacity-100'
                                          : 'opacity-0',
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-row gap-x-1">
              <FormField
                control={props.control}
                name="secondaryTextGrammage"
                render={({ field }) => (
                  <FormItem className="w-20">
                    <FormLabel>Paper GSM</FormLabel>
                    <FormControl>
                      <Input {...field}></Input>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={props.control}
                name="secondaryTextPaperType"
                render={({ field }) => (
                  <FormItem
                    className="flex flex-col 
           gap-y-1 pt-[6px]"
                  >
                    <FormLabel>Secondary Text Paper Type</FormLabel>

                    <Popover
                      open={openSecondaryPaperType}
                      onOpenChange={setOpenSecondaryPaperType}
                    >
                      <PopoverTrigger className="" asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openSecondaryPaperType}
                          className="w-56 justify-between"
                        >
                          <input
                            type="hidden"
                            {...field}
                            value={field.value ? field.value : ''}
                          />
                          {field.value
                            ? paperTypes.find(
                                (type) => type.label === field.value,
                              )?.label
                            : 'Select paper type...'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search paper types..."
                            className="h-10"
                          />
                          <CommandEmpty>No paper type found.</CommandEmpty>
                          <CommandGroup>
                            <CommandList>
                              {paperTypes.map((type) => (
                                <CommandItem
                                  key={type.label}
                                  value={type.label}
                                  onSelect={() => {
                                    props.form.setValue(
                                      'secondaryTextPaperType',
                                      type.label,
                                    )
                                    field.onChange(type.label)
                                    props.form.trigger('secondaryTextPaperType') // Trigger form validation and state update

                                    setOpenSecondaryPaperType(false)
                                  }}
                                >
                                  {type.label}
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      field.value === type.label
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        {/* <AccordionItem value="sheet inserts">
          <AccordionTrigger>Add Sheet Inserts</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-y-2 p-1">
            <div className="flex flex-row gap-x-1">
              <div className="flex flex-col">
                {' '}
                <FormField
                  control={props.control}
                  name="insertColors"
                  render={({ field }) => (
                    <FormItem className="w-16">
                      <FormLabel>#Colors</FormLabel>
                      <FormControl>
                        <Input {...field}></Input>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col">
                {' '}
                <FormField
                  control={props.control}
                  name="insertPages"
                  render={({ field }) => (
                    <FormItem className="w-16">
                      <FormLabel>#Pages</FormLabel>
                      <FormControl>
                        <Input {...field}></Input>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col">
                {' '}
                <FormField
                  control={props.control}
                  name="insertLamination"
                  render={({ field }) => (
                    <FormItem
                      className="flex flex-col 
           gap-y-1 pt-[6px]"
                    >
                      <FormLabel>Insert Lamination</FormLabel>

                      <Popover
                        open={openInsertLamination}
                        onOpenChange={setOpenInsertLamination}
                      >
                        <PopoverTrigger className="" asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openInsertLamination}
                            className="w-48 justify-between"
                          >
                            <input
                              type="hidden"
                              {...field}
                              value={field.value ? field.value : ''}
                            />
                            {field.value
                              ? laminations.find(
                                  (size) => size.label === field.value,
                                )?.label
                              : 'Select lamination...'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search laminations..."
                              className="h-10"
                            />
                            <CommandEmpty>No lamination found.</CommandEmpty>
                            <CommandGroup>
                              <CommandList>
                                {laminations.map((lam) => (
                                  <CommandItem
                                    key={lam.label}
                                    value={lam.label}
                                    onSelect={() => {
                                      props.form.setValue(
                                        'insertLamination',
                                        lam.label,
                                      )
                                      field.onChange(lam.label)
                                      props.form.trigger('insertLamination') // Trigger form validation and state update

                                      setOpenInsertLamination(false)
                                    }}
                                  >
                                    {lam.label}
                                    <CheckIcon
                                      className={cn(
                                        'ml-auto h-4 w-4',
                                        field.value === lam.label
                                          ? 'opacity-100'
                                          : 'opacity-0',
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-row gap-x-1">
              <FormField
                control={props.control}
                name="insertGrammage"
                render={({ field }) => (
                  <FormItem className="w-20">
                    <FormLabel>Paper GSM</FormLabel>
                    <FormControl>
                      <Input {...field}></Input>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={props.control}
                name="insertPaperType"
                render={({ field }) => (
                  <FormItem
                    className="flex flex-col 
           gap-y-1 pt-[6px]"
                  >
                    <FormLabel>Insert Paper Type</FormLabel>

                    <Popover
                      open={openInsertPaperType}
                      onOpenChange={setOpenInsertPaperType}
                    >
                      <PopoverTrigger className="" asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openInsertPaperType}
                          className="w-56 justify-between"
                        >
                          <input
                            type="hidden"
                            {...field}
                            value={field.value ? field.value : ''}
                          />
                          {field.value
                            ? paperTypes.find(
                                (type) => type.label === field.value,
                              )?.label
                            : 'Select paper type...'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search paper types..."
                            className="h-10"
                          />
                          <CommandEmpty>No paper type found.</CommandEmpty>
                          <CommandGroup>
                            <CommandList>
                              {paperTypes.map((type) => (
                                <CommandItem
                                  key={type.label}
                                  value={type.label}
                                  onSelect={() => {
                                    props.form.setValue(
                                      'insertPaperType',
                                      type.label,
                                    )
                                    field.onChange(type.label)
                                    props.form.trigger('insertPaperType') // Trigger form validation and state update

                                    setOpenInsertPaperType(false)
                                  }}
                                >
                                  {type.label}
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      field.value === type.label
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>
          </AccordionContent>
        </AccordionItem> */}
      </Accordion>

      <MySep />
    </div>
  )
}
