import {
  Controller,
  Get,
  // Post,
  // Put,
  // Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RbacGuard } from '../rbac/guards/rbac.guard';
import { Roles } from '../rbac/decorators/roles.decorator';
import { ContactsService } from './contacts.service';
import { ContactFilterDto } from './dto/contact-filter.dto';
// import { CreateContactDto } from './dto/create-contact.dto';
// import { UpdateContactDto } from './dto/update-contact.dto';

@ApiTags('Contacts')
@ApiBearerAuth()
@Controller('contacts')
@UseGuards(JwtAuthGuard, RbacGuard)
@Roles('super_admin')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all contacts with search and pagination' })
  async findAll(@Query() filterDto: ContactFilterDto) {
    const result = await this.contactsService.findAll(filterDto);

    return {
      is_success: true,
      message: 'Contacts fetched successfully',
      data: result.data,
      pagination: result.pagination,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contact by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const contact = await this.contactsService.findOne(id);

    return {
      is_success: true,
      message: 'Contact fetched successfully',
      data: contact,
    };
  }

  // @Post()
  // @ApiOperation({ summary: 'Create a new contact' })
  // async create(@Body() createContactDto: CreateContactDto) {
  //   const contact = await this.contactsService.create(createContactDto);

  //   return {
  //     is_success: true,
  //     message: 'Contact created successfully',
  //     data: contact,
  //   };
  // }

  // @Put(':id')
  // @ApiOperation({ summary: 'Update contact by ID' })
  // async update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateContactDto: UpdateContactDto,
  // ) {
  //   const contact = await this.contactsService.update(id, updateContactDto);

  //   return {
  //     is_success: true,
  //     message: 'Contact updated successfully',
  //     data: contact,
  //   };
  // }

  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete contact by ID' })
  // async remove(@Param('id', ParseIntPipe) id: number) {
  //   await this.contactsService.remove(id);

  //   return {
  //     is_success: true,
  //     message: 'Contact deleted successfully',
  //   };
  // }
}
