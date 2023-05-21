import * as React from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Stack,
  Switch,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from 'react';

const IndexPage = () => {
  const [pairs, setPairs] = useState([{}]);
  const [json, setJson] = useState('');
  const [isArray, setIsArray] = useState(true);
  const toast = useToast();
  const [lastToast, setLastToast] = useState(0);

  useEffect(() => {
    const savedPairs = window.localStorage.getItem('slot1');
    if (savedPairs) {
      const loadedPairs = JSON.parse(savedPairs);
      setPairs(loadedPairs);
      const newJson = isArray
          ? loadedPairs
          : loadedPairs.reduce((obj, pair) => ({ ...obj, [pair.key]: pair.value }), {});
      setJson(JSON.stringify(newJson, null, 2));
    }
  }, []);


  const handlePairChange = (index, key, value) => {
    const newPairs = [...pairs];
    newPairs[index] = { key, value };
    setPairs(newPairs);
    const newJson = isArray
        ? newPairs
        : newPairs.reduce((obj, pair) => ({ ...obj, [pair.key]: pair.value }), {});
    setJson(JSON.stringify(newJson, null, 2));
  };

  const handleJsonChange = (event) => {
    try {
      const newJson = event.target.value;
      setJson(newJson);
      const newPairs = Object.entries(JSON.parse(newJson)).map(([key, value]) => ({ key, value }));
      setPairs(newPairs);
    } catch (err) {
      const now = Date.now();
      if (now - lastToast >= 3000) {
        toast({
          title: "Invalid JSON",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setLastToast(now);
      }
    }
  };

  const addPair = () => {
    setPairs([...pairs, {}]);
  };

  const toggleArray = () => {
    setIsArray(!isArray);
    const newJson = isArray
        ? pairs.reduce((obj, pair) => ({ ...obj, [pair.key]: pair.value }), {})
        : pairs;
    setJson(JSON.stringify(newJson, null, 2));
  }

  const saveToLocalStorage = (slot) => {
    window.localStorage.setItem(`slot${slot}`, JSON.stringify(pairs));
    toast({
      title: `Saved to slot ${slot}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  }

  const loadFromLocalStorage = (slot) => {
    const savedPairs = window.localStorage.getItem(`slot${slot}`);
    if (savedPairs) {
      const loadedPairs = JSON.parse(savedPairs);
      setPairs(loadedPairs);
      const newJson = isArray
          ? loadedPairs
          : loadedPairs.reduce((obj, pair) => ({ ...obj, [pair.key]: pair.value }), {});
      setJson(JSON.stringify(newJson, null, 2));
    } else {
      toast({
        title: `No data in slot ${slot}`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  };


  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };


  return (
      <Container maxW="container.xl">
        <Heading as="h1" size="lg" textAlign="center" my={5}>
          {"KeyValuePair < --- > JSON Transformer"}
        </Heading>
        <Flex p={5} direction={{ base: "column", md: "row" }}>
          <Stack flex={1} spacing={3} mb={{ base: 5, md: 0 }} mr={{ md: 5 }}>
            {pairs.map((pair, index) => (
                <Flex key={index}>
                  <Input flex={1} value={pair.key} onChange={e => handlePairChange(index, e.target.value, pair.value)} placeholder="Key" />
                  <Input flex={1} value={pair.value} onChange={e => handlePairChange(index, pair.key, e.target.value)} placeholder="Value" />
                </Flex>
            ))}
            <Button onClick={addPair}>Add pair</Button>
            <Flex align="center">
              <Switch isChecked={isArray} onChange={toggleArray} />
              <Box ml={2}>Array format</Box>
            </Flex>
            <Button onClick={() => copyToClipboard(json)}>Copy</Button>
            <Textarea
                value={json}
                onChange={handleJsonChange}
                placeholder="JSON"
                padding={3}
                fontFamily="mono"
                bg="gray.800"
                color="white"
                borderRadius="md"
                minH="unset"
                height="15rem"
                size="bg"
            />
            <Flex mt={3} flexWrap="wrap">
              {[1,2,3,4,5].map((slot) => (
                  <Flex key={slot} mb={2} mr={2}>
                    <Button onClick={() => saveToLocalStorage(slot)}>Save to slot {slot}</Button>
                    <Button ml={2} onClick={() => loadFromLocalStorage(slot)}>Load from slot {slot}</Button>
                  </Flex>
              ))}
            </Flex>
          </Stack>
        </Flex>
      </Container>
  );
};

export default IndexPage;
