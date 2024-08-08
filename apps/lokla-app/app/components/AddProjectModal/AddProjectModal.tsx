import { AddIcon } from '@chakra-ui/icons';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Tag,
  TagCloseButton,
  TagLabel,
  useDisclosure,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { RequestCreateProject } from '../../data/models/RequestCreateProject';
import { Locales } from 'lib/constants/locales';
import { useCreateProject } from '../../usecases/CreateProjectUseCase';

const AddProjectModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const form = useForm<RequestCreateProject>({
    defaultValues: {
      defaultLanguage: 'en',
      languages: [],
    },
  });

  const addProject = useCreateProject(() => {
    onClose();
    form.reset({
      defaultLanguage: 'en',
      languages: [],
    });
  });

  return (
    <>
      <Button leftIcon={<AddIcon />} onClick={onOpen}>
        Add Project
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Project</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <FormControl>
                <FormLabel>Project Name</FormLabel>
                <Input {...form.register('name')} />
              </FormControl>

              <FormControl>
                <FormLabel>Project Identifier</FormLabel>
                <Input {...form.register('identifier')} />
              </FormControl>

              <FormControl>
                <FormLabel>Default Language</FormLabel>
                <Select {...form.register('defaultLanguage')}>
                  {Locales.map((item) => (
                    <option value={item.code} key={item.code}>
                      {item.name} ({item.code})
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Target Languages</FormLabel>
                <Controller
                  control={form.control}
                  name="languages"
                  rules={{
                    validate: (value) => {
                      if (value.length === 0) {
                        return 'At least one language is required';
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <Select
                        onChange={(event) => {
                          field.onChange([...field.value, event.target.value]);
                        }}
                      >
                        {Locales.map((item) => (
                          <option value={item.code} key={item.code}>
                            {item.name} ({item.code})
                          </option>
                        ))}
                      </Select>
                      <div className="flex flex-row gap-4 flex-wrap mt-2">
                        {field.value.map((value) => (
                          <Tag>
                            <TagLabel>
                              {Locales.find((locale) => locale.code === value)
                                ?.name ?? value}
                            </TagLabel>
                            <TagCloseButton
                              onClick={() => {
                                field.onChange(
                                  [...field.value].filter(
                                    (item) => item !== value
                                  )
                                );
                              }}
                            />
                          </Tag>
                        ))}
                      </div>
                    </>
                  )}
                />
              </FormControl>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              isDisabled={addProject.isPending || !form.formState.isValid}
              onClick={form.handleSubmit((data) => {
                addProject.mutate(data);
              })}
            >
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddProjectModal;
