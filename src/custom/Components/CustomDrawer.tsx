"use client"

import { Button, CloseButton, Drawer, Portal } from "@chakra-ui/react"
import { useState } from "react"

const CustomDrawer = () => {
  const [open, setOpen] = useState(false)

  return (
    <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)} placement={"start"}>
      <Drawer.Trigger asChild>
        <Button variant="outline" size="sm" colorScheme={"blue"}>
          Open Drawersss
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
            </Drawer.Header>
            <Drawer.Body>
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Drawer.ActionTrigger>
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}

export default CustomDrawer
